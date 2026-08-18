import type { ReactNode } from 'react'

type IconProps = { className?: string }
const Svg = ({ children, className }: IconProps & { children: ReactNode }) => <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>

export const LoginIcon = (props: IconProps) => <Svg {...props}><path d="M14 8l4 4-4 4"/><path d="M18 12H7"/><path d="M11 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/></Svg>
export const LogoutIcon = (props: IconProps) => <Svg {...props}><path d="M10 8l-4 4 4 4"/><path d="M6 12h11"/><path d="M13 4h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"/></Svg>
export const JoinIcon = (props: IconProps) => <Svg {...props}><circle cx="10" cy="8" r="3"/><path d="M4 20v-2a5 5 0 0 1 5-5h2a5 5 0 0 1 4 2"/><path d="M18 7v6M15 10h6"/></Svg>
export const BellIcon = (props: IconProps) => <Svg {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></Svg>
