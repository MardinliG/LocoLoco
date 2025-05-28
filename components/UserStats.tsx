"use client"

import { getUserLevel } from "@/lib/levelSystem"

type UserStatsProps = {
  favoritesCount: number
  quizCount: number
  memberSince: string | null
  totalPoints: number
}

export default function UserStats({ favoritesCount, quizCount, memberSince, totalPoints }: UserStatsProps) {
  const userLevel = getUserLevel(totalPoints)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-6 text-center shadow-mexican border-l-4 border-orange-400">
        <div className="text-3xl mb-2">🍸</div>
        <div className="text-2xl font-bold text-orange-600">{favoritesCount}</div>
        <p className="text-sm text-gray-600">Favoris</p>
      </div>
      <div className="bg-white rounded-lg p-6 text-center shadow-mexican border-l-4 border-yellow-400">
        <div className="text-3xl mb-2">🎯</div>
        <div className="text-2xl font-bold text-yellow-600">{quizCount}</div>
        <p className="text-sm text-gray-600">Quiz réalisés</p>
      </div>
      <div className="bg-white rounded-lg p-6 text-center shadow-mexican border-l-4 border-green-400">
        <div className="text-3xl mb-2">📅</div>
        <div className="text-lg font-bold text-green-600">
          {memberSince ? new Date(memberSince).getFullYear() : "N/A"}
        </div>
        <p className="text-sm text-gray-600">Membre depuis</p>
      </div>
      <div className={`bg-white rounded-lg p-6 text-center shadow-mexican border-l-4 ${userLevel.borderColor}`}>
        <div className="text-3xl mb-2">{userLevel.emoji}</div>
        <div className={`text-lg font-bold ${userLevel.color}`}>{userLevel.name}</div>
        <p className="text-sm text-gray-600">Niveau</p>
        <p className="text-xs text-gray-500 mt-1">{totalPoints} pts</p>
      </div>
    </div>
  )
}
