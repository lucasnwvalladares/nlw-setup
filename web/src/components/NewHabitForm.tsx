import { Check } from "phosphor-react";

export function NewHabitForm() {
  return (
    <form
      className="w-full flex flex-col mt-6"
    >
      <label 
        htmlFor="title"
        className="font-semibold leading-tight"
      >
        Qual seu comprometimento?
      </label>
      <input 
        type="text"
        id="title"
        className="rounded-lg p-4 mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        placeholder="ex.: Fazer 1h de exercícios..."  
        autoFocus
      />

      <label 
        htmlFor=""
        className="font-semibold leading-tight mt-4"
      >
        Quais dias da semana?
      </label>

      <button
        type="submit"
        className="rounded-lg p-4 mt-6 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}