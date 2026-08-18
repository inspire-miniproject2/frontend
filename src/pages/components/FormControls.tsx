import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => <input className="text-input" {...props} />
export const SelectInput = (props: SelectHTMLAttributes<HTMLSelectElement>) => <select className="select-input" {...props} />
