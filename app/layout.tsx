import './globals.css'
import { ReactNode } from 'react'


export const metadata = {
title: 'Wireframe Noticias — Pro++',
description: 'Portal de noticias y eventos - Campus'
}


export default function RootLayout({ children }: { children: ReactNode }) {
return (
<html lang="es">
<body>
<div className="max-w-[1200px] mx-auto p-5">
{children}
</div>
</body>
</html>
)
}