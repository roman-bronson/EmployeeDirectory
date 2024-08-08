Import-Module ActiveDirectory

function ExportUsersToJSON {
    $filter = "enabled -eq 'true' -and department -ne 'EXCLUDE'"
    $properties = @(
        "givenname",
        "sn",
        "title",
        "manager",
        "physicaldeliveryofficename",
        "mail",
        "officephone",
        "samAccountName",
        "thumbnailphoto"
    )
    
    $defaultLocation = "Front Desk"
    $users = Get-Aduser -Filter $filter -Properties $properties -SearchBase 'DC=NSHC,DC=LOCAL' | select $properties
    foreach ($user in $users) {
        if ($user.manager) {
            $user.manager = (Get-ADUser $user.manager -Properties Name).name
        }
        if (!$user.givenname) {
            $user.givenname = ""
        }
        if (!$user.sn) {
            $user.sn = ""
        }
        if (!$user.title) {
            $user.title = ""
        }
        if (!$user.manager) {
            $user.manager = ""
        }
        if (!$user.physicaldeliveryofficename) {
            $user.physicaldeliveryofficename = $defaultLocation
        }
        if (!$user.mail) {
            $user.mail = ""
        }
        if (!$user.officephone) {
            $user.officephone = ""
        }
        
        $imagesPath = "C:\Users\rbronson\Coding\Website\Photos"
        $file = "$imagesPath\$($user.samAccountName).jpg"
        if (-not (Test-Path $file)) {
            if ($user.thumbnailphoto) {
                Try {
                    $user.thumbnailphoto | Set-Content -Path $file -Encoding Byte -ErrorAction Stop
                }
                Catch {
                    Write-Error Unable to save thumbnail to $file. Aborting script.
                    Exit 1
                }
            }
        }

        if (!$user.thumbnailphoto) {
            $user.thumbnailphoto = "False"
        }
        else {
            $user.thumbnailphoto = "True"
        }
    }

    $users | Sort-Object givenname | ConvertTo-Json | Out-File "C:\Users\rbronson\Coding\Website\data1.json" -Encoding utf8
}

ExportUsersToJSON