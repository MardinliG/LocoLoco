'use client'

import { useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'

type Question = {
    id: string
    question: string
    correct_answer: string
    options: string[]
    created_at: string
}

export default function QuestionManager({ initialQuestions }: { initialQuestions: Question[] }) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions)
    const [isAdding, setIsAdding] = useState(false)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        question: '',
        correct_answer: '',
        options: ['', '', '', '']
    })

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsAdding(true)

        try {
            // Vérifier que la réponse correcte est dans les options
            if (!formData.options.includes(formData.correct_answer)) {
                toast.error('La réponse correcte doit être une des options')
                return
            }

            // Vérifier qu'il n'y a pas d'options vides
            if (formData.options.some(option => !option.trim())) {
                toast.error('Toutes les options doivent être remplies')
                return
            }

            // Vérifier qu'il n'y a pas d'options en double
            const uniqueOptions = new Set(formData.options)
            if (uniqueOptions.size !== formData.options.length) {
                toast.error('Les options ne doivent pas être en double')
                return
            }

            console.log('Envoi des données:', formData)

            const { data, error } = await supabaseAdmin
                .from('quiz_questions')
                .insert([{
                    question: formData.question.trim(),
                    correct_answer: formData.correct_answer.trim(),
                    options: formData.options.map(opt => opt.trim())
                }])
                .select()
                .single()

            if (error) {
                console.error('Erreur Supabase:', error)
                throw error
            }

            console.log('Question ajoutée avec succès:', data)

            setQuestions([data, ...questions])
            setFormData({
                question: '',
                correct_answer: '',
                options: ['', '', '', '']
            })
            toast.success('Question ajoutée avec succès')
        } catch (error) {
            console.error('Error adding question:', error)
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`)
            } else {
                toast.error('Erreur lors de l\'ajout de la question')
            }
        } finally {
            setIsAdding(false)
        }
    }

    const handleEditQuestion = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isEditing) return

        try {
            // Vérifier que la réponse correcte est dans les options
            if (!formData.options.includes(formData.correct_answer)) {
                toast.error('La réponse correcte doit être une des options')
                return
            }

            // Vérifier qu'il n'y a pas d'options vides
            if (formData.options.some(option => !option.trim())) {
                toast.error('Toutes les options doivent être remplies')
                return
            }

            // Vérifier qu'il n'y a pas d'options en double
            const uniqueOptions = new Set(formData.options)
            if (uniqueOptions.size !== formData.options.length) {
                toast.error('Les options ne doivent pas être en double')
                return
            }

            console.log('Mise à jour des données:', formData)

            const { error } = await supabaseAdmin
                .from('quiz_questions')
                .update({
                    question: formData.question.trim(),
                    correct_answer: formData.correct_answer.trim(),
                    options: formData.options.map(opt => opt.trim())
                })
                .eq('id', isEditing)

            if (error) {
                console.error('Erreur Supabase:', error)
                throw error
            }

            setQuestions(questions.map(q =>
                q.id === isEditing ? {
                    ...q,
                    question: formData.question.trim(),
                    correct_answer: formData.correct_answer.trim(),
                    options: formData.options.map(opt => opt.trim())
                } : q
            ))
            setIsEditing(null)
            setFormData({
                question: '',
                correct_answer: '',
                options: ['', '', '', '']
            })
            toast.success('Question modifiée avec succès')
        } catch (error) {
            console.error('Error editing question:', error)
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`)
            } else {
                toast.error('Erreur lors de la modification de la question')
            }
        }
    }

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return

        setIsDeleting(id)
        try {
            const { error } = await supabaseAdmin
                .from('quiz_questions')
                .delete()
                .eq('id', id)

            if (error) {
                console.error('Erreur Supabase:', error)
                throw error
            }

            setQuestions(questions.filter(q => q.id !== id))
            toast.success('Question supprimée avec succès')
        } catch (error) {
            console.error('Error deleting question:', error)
            if (error instanceof Error) {
                toast.error(`Erreur: ${error.message}`)
            } else {
                toast.error('Erreur lors de la suppression de la question')
            }
        } finally {
            setIsDeleting(null)
        }
    }

    const startEditing = (question: Question) => {
        setIsEditing(question.id)
        setFormData({
            question: question.question,
            correct_answer: question.correct_answer,
            options: question.options
        })
    }

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {isEditing ? 'Modifier la question' : 'Ajouter une nouvelle question'}
                </h2>
                <form onSubmit={isEditing ? handleEditQuestion : handleAddQuestion} className="space-y-4">
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                            Question
                        </label>
                        <input
                            type="text"
                            id="question"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="correct_answer" className="block text-sm font-medium text-gray-700">
                            Réponse correcte
                        </label>
                        <input
                            type="text"
                            id="correct_answer"
                            value={formData.correct_answer}
                            onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options de réponse
                        </label>
                        {formData.options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => {
                                    const newOptions = [...formData.options]
                                    newOptions[index] = e.target.value
                                    setFormData({ ...formData, options: newOptions })
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-2"
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3">
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(null)
                                    setFormData({
                                        question: '',
                                        correct_answer: '',
                                        options: ['', '', '', '']
                                    })
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isAdding ? 'Ajout en cours...' : isEditing ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h2 className="text-xl font-semibold text-gray-900 p-6 border-b">
                    Questions existantes
                </h2>
                <div className="divide-y divide-gray-200">
                    {questions.map((question) => (
                        <div key={question.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {question.question}
                                    </h3>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Réponse correcte :</span>{' '}
                                            {question.correct_answer}
                                        </p>
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium">Options :</span>
                                            <ul className="list-disc list-inside mt-1">
                                                {question.options.map((option, index) => (
                                                    <li key={index}>{option}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => startEditing(question)}
                                        className="p-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEdit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        disabled={isDeleting === question.id}
                                        className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                                    >
                                        {isDeleting === question.id ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-600"></div>
                                        ) : (
                                            <FiTrash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 