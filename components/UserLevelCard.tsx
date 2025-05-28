"use client"

import { getUserLevel, getProgressToNextLevel } from "@/lib/levelSystem"

type UserLevelCardProps = {
  totalPoints: number
}

export default function UserLevelCard({ totalPoints }: UserLevelCardProps) {
  const userLevel = getUserLevel(totalPoints)
  const levelProgress = getProgressToNextLevel(totalPoints)

  return (
    <div className="bg-white rounded-lg p-6 shadow-mexican border-l-4 border-gradient-to-r from-orange-400 to-red-400">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">🏆 Niveau Mixologie</h3>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">{userLevel.emoji}</span>
          <div>
            <h4 className={`text-2xl font-bold ${userLevel.color}`}>{userLevel.name}</h4>
            <p className="text-gray-600">{totalPoints} points au total</p>
          </div>
        </div>

        {/* Barre de progression */}
        {levelProgress.nextLevel && (
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                {userLevel.emoji} {userLevel.name}
              </span>
              <span>
                {levelProgress.nextLevel.emoji} {levelProgress.nextLevel.name}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-500`}
                style={{ width: `${levelProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Plus que {levelProgress.pointsToNext} points pour devenir {levelProgress.nextLevel.name} !
            </p>
          </div>
        )}

        {!levelProgress.nextLevel && (
          <div className="max-w-md mx-auto">
            <div className="w-full bg-gradient-to-r from-red-400 to-yellow-400 rounded-full h-3 mb-2"></div>
            <p className="text-sm font-bold text-red-600">🎉 Niveau maximum atteint ! Vous êtes une légende !</p>
          </div>
        )}
      </div>
    </div>
  )
}
