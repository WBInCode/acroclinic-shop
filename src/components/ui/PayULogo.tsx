/**
 * PayU Logo Component
 * Renders the PayU corporate logo using styled text + decorative dots.
 */
export function PayULogo({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: { text: 'text-lg', dot1: 'w-[5px] h-[5px]', dot2: 'w-[3.5px] h-[3.5px]', dot3: 'w-[2.5px] h-[2.5px]', gap: 'gap-[1px]' },
        md: { text: 'text-2xl', dot1: 'w-[6px] h-[6px]', dot2: 'w-[4px] h-[4px]', dot3: 'w-[3px] h-[3px]', gap: 'gap-[1.5px]' },
        lg: { text: 'text-3xl', dot1: 'w-[8px] h-[8px]', dot2: 'w-[5px] h-[5px]', dot3: 'w-[4px] h-[4px]', gap: 'gap-[2px]' },
    }

    const s = sizes[size]

    return (
        <div className={`inline-flex items-start ${className}`}>
            <span
                className={`${s.text} font-black tracking-tight leading-none`}
                style={{ fontFamily: "'Nunito Sans', 'Arial Black', 'Helvetica', sans-serif" }}
            >
                Pay
            </span>
            <span
                className={`${s.text} font-black tracking-tight leading-none`}
                style={{ fontFamily: "'Nunito Sans', 'Arial Black', 'Helvetica', sans-serif" }}
            >
                U
            </span>
            {/* Decorative dots */}
            <div className={`flex flex-col ${s.gap} ml-[1px] mt-[1px]`}>
                <div className="flex gap-[1px]">
                    <div className={`${s.dot1} bg-current rounded-[1px]`} />
                    <div className={`${s.dot2} bg-current rounded-[1px]`} />
                </div>
                <div className="flex justify-end">
                    <div className={`${s.dot3} bg-current rounded-[0.5px]`} />
                </div>
            </div>
        </div>
    )
}
