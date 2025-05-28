"use client"

import type React from "react"
import { useState } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { supabase } from "@/lib/supabase"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit3, Save, X, Calendar, Shield, Mail, User } from "lucide-react"

type Profile = {
  id: string
  username: string
  created_at: string
  role: string
}

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const { session } = useSupabase()
  const [username, setUsername] = useState(profile?.username || "")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", session?.user.id)
        .single()

      if (existingUser) {
        toast.error("¡Ay, caramba! Ce nom d'utilisateur est déjà pris 😅")
        return
      }

      const { error } = await supabase.from("profiles").update({ username }).eq("id", session?.user.id)

      if (error) throw error

      toast.success("¡Perfecto! Profil mis à jour avec succès 🎉")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("¡Ay, no! Erreur lors de la mise à jour 😰")
    } finally {
      setIsLoading(false)
    }
  }

  const memberSince = new Date(profile?.created_at || "").toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const isAdmin = profile?.role === "admin"

  return (
    <Card className="shadow-mexican border-0">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <User className="h-5 w-5 text-orange-500 mr-2" />🌮 Informations Personnelles
          </CardTitle>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Avatar et nom */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg mx-auto">
              {session?.user.email?.[0]?.toUpperCase() || "👤"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
              <div className="text-lg">🍹</div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-mexican-gradient mb-2">
             {username || session?.user.email?.split("@")[0] || "Amigo"}! 👋
          </h2>
          <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-sm px-3 py-1">
            {isAdmin ? "👑 Administrateur" : "👤 Membre LocoLoco"}
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 text-blue-500 mr-2" />📧 Adresse Email
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-gray-900 text-sm">{session?.user.email}</p>
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 text-orange-500 mr-2" />
                🏷️ Nom d'utilisateur
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-orange-200 focus:border-orange-400"
                  required
                  minLength={3}
                  maxLength={20}
                  placeholder="Votre nom d'utilisateur..."
                />
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-gray-900 text-sm">{username || "Non défini"}</p>
                </div>
              )}
            </div>

            {/* Membre depuis */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 text-green-500 mr-2" />📅 Membre depuis
              </label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-gray-900 text-sm">{memberSince}</p>
              </div>
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Shield className="h-4 w-4 text-purple-500 mr-2" />🎭 Statut du compte
              </label>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-xs">
                  {isAdmin ? "👑 Administrateur" : "👤 Utilisateur"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          {isEditing && (
            <div className="flex justify-center space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />💾 Enregistrer
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setUsername(profile?.username || "")
                }}
              >
                <X className="h-4 w-4 mr-2" />❌ Annuler
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
