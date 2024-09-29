import { Darumadrop_One, DM_Sans, Inter, Montserrat, Radio_Canada, Roboto } from "next/font/google"

export const darumadrop = Darumadrop_One({
    subsets: ['latin-ext'],
    variable: '--font-darumadrop-one',
    weight: '400',
    display: 'swap',
})

export const inter = Inter({ subsets: ['latin'] })

export const roboto = Roboto({ subsets: ['latin'],
    variable: '--font-roboto',
    weight: '400',
 })

export const radioCanada = Radio_Canada({
    subsets: ['latin'],
    variable: '--font-radio-canada',
    weight: '600',
    display: 'swap',
})

export const DMSans =DM_Sans({
    subsets: ['latin'],
    variable: '--font-mulish',
    weight: '400',
    display: 'swap',
})

export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-noto-sans-javanese',
    weight: '800',
    display: 'swap',
})