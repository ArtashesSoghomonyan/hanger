import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function canUpdate(): Promise<boolean | null> {
  // Checking if there is a update available or not
  // If something will go wrong, it will return null (for example no internet)
  async function getNewestVersion() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/ArtashesSoghomonyan/hanger/refs/heads/main/package.json")
      const data = await response.json()
      return data.version || null
    } catch {
      return null
    }
  }

  const newestVersion: string | null = await getNewestVersion()

  if (newestVersion == null) {
    return null
  }

  const [ newestMajorVersion, newestMinorVersion, newestPatchVersion ] = newestVersion.split(".")
  const appVersion = __APP_VERSION__
  const [ ourMajorVersion, ourMinorVersion, ourPatchVersion ] = newestVersion.split(".")

  if (Number(newestMajorVersion) > Number(ourMajorVersion)) return true
  if (Number(newestMinorVersion) > Number(ourMinorVersion)) return true
  if (Number(newestPatchVersion) > Number(ourPatchVersion)) return true

  return false;
}
