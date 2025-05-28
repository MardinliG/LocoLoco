"use client"

import { COCKTAIL_LEVELS, getUserLevel } from "@/lib/levelSystem"

type LevelSystemTableProps = {
  totalPoints: number
}

export default function LevelSystemTable({ totalPoints }: LevelSystemTableProps) {
  const userLevel = getUserLevel(totalPoints)

  return (
    <div className="bg-white rounded-lg p-6 shadow-mexican">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">🎯 Système de Niveaux</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {COCKTAIL_LEVELS.map((level, index) => (
          <div
            key={level.name}
            className={`p-3 rounded-lg border-2 transition-all ${
              userLevel.name === level.name
                ? `${level.bgColor} ${level.borderColor} scale-105`
                : totalPoints >= level.minPoints
                  ? `${level.bgColor} border-gray-200 opacity-75`
                  : "bg-gray-50 border-gray-200 opacity-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{level.emoji}</span>
              <div>
                <h4 className={`font-bold ${level.color}`}>{level.name}</h4>
                <p className="text-xs text-gray-600">
                  {level.maxPoints === Number.POSITIVE_INFINITY
                    ? `${level.minPoints}+ pts`
                    : `${level.minPoints}-${level.maxPoints} pts`}
                </p>
              </div>
              {userLevel.name === level.name && <span className="ml-auto text-green-500 font-bold">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
