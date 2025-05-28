
export const COCKTAIL_LEVELS = [
  {
    name: "Novato",
    emoji: "🌱",
    minPoints: 0,
    maxPoints: 49,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-400",
  },
  {
    name: "Limonero",
    emoji: "🍋",
    minPoints: 50,
    maxPoints: 149,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
  },
  {
    name: "Picante",
    emoji: "🌶️",
    minPoints: 150,
    maxPoints: 299,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-400",
  },
  {
    name: "Tequilero",
    emoji: "🥃",
    minPoints: 300,
    maxPoints: 499,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-400",
  },
  {
    name: "Mixólogo",
    emoji: "🍹",
    minPoints: 500,
    maxPoints: 799,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-400",
  },
  {
    name: "Maestro",
    emoji: "👑",
    minPoints: 800,
    maxPoints: 1199,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-400",
  },
  {
    name: "Leyenda",
    emoji: "🔥",
    minPoints: 1200,
    maxPoints: Number.POSITIVE_INFINITY,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-400",
  },
]

export function getUserLevel(totalPoints: number) {
  return (
    COCKTAIL_LEVELS.find((level) => totalPoints >= level.minPoints && totalPoints <= level.maxPoints) ||
    COCKTAIL_LEVELS[0]
  )
}

export function getProgressToNextLevel(totalPoints: number) {
  const currentLevel = getUserLevel(totalPoints)
  const currentLevelIndex = COCKTAIL_LEVELS.findIndex((level) => level.name === currentLevel.name)

  if (currentLevelIndex === COCKTAIL_LEVELS.length - 1) {
    // Niveau maximum atteint
    return { progress: 100, pointsToNext: 0, nextLevel: null }
  }

  const nextLevel = COCKTAIL_LEVELS[currentLevelIndex + 1]
  const pointsInCurrentLevel = totalPoints - currentLevel.minPoints
  const pointsNeededForLevel = nextLevel.minPoints - currentLevel.minPoints
  const progress = Math.min((pointsInCurrentLevel / pointsNeededForLevel) * 100, 100)
  const pointsToNext = nextLevel.minPoints - totalPoints

  return { progress, pointsToNext, nextLevel }
}

export function calculateTotalPoints(quizResults: Array<{ score: number }>) {
  return quizResults?.reduce((sum, quiz) => sum + (quiz.score || 0), 0) || 0
}
