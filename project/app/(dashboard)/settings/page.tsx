import { getOrCreateDbUser } from "@/lib/auth"
import { SettingsClient } from "@/components/settings/settings-client"
import { Shield } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const dbUser = await getOrCreateDbUser()

  if (!dbUser) {
    return (
      <div className="min-h-screen bg-[#15100C] flex items-center justify-center p-6 text-center text-[#D7B05C] font-serif">
        <div className="p-8 border-2 border-[#8F6236] bg-[#2D1B10] rounded-xs shadow-2xl">
          <Shield className="mx-auto mb-3 text-[#D7B05C]" size={32} />
          <h2 className="text-xl font-black uppercase tracking-widest text-[#F8EEDB]">
            Access Denied
          </h2>
          <p className="text-xs font-sans text-[#D7B05C]/70 mt-2">
            Unauthorized traveler. Please sign in to configure realm settings.
          </p>
        </div>
      </div>
    )
  }

  return (
    <SettingsClient
      user={{
        name: dbUser.name,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
      }}
    />
  )
}