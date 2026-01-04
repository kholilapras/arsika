import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'

export default function Welcome() {
    const { auth } = usePage<SharedData>().props

    return (
        <>
            <Head title="ARSIKA">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {/* (Opsional) Logo kecil di header kiri - kalau mau, ganti justify-end jadi justify-between lalu aktifkan blok ini */}
                        {/*
                        <div className="flex items-center gap-2">
                            <img src="/logoo.svg" alt="Logo ARSIKA" className="h-7 w-7 opacity-70" />
                            <span className="font-medium dark:text-[#EDEDEC]">ARSIKA</span>
                        </div>
                        */}

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                {/* tombol login/register kamu sedang disembunyikan */}
                            </>
                        )}
                    </nav>
                </header>

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        {/* LEFT: CONTENT */}
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium">ARSIKA (Arsip Kendali Mutu)</h1>

                            <p className="mb-4 text-[#706f6c] dark:text-[#A1A09A]">
                                Sistem informasi untuk pengelolaan arsip kendali mutu membantu penyimpanan, pencarian,
                                dan monitoring dokumen mutu.
                            </p>

                            <ul className="mb-6 flex flex-col">
                                <li className="relative flex items-start gap-4 py-2 before:absolute before:top-0 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>Kelola arsip dokumen mutu terpusat (upload, versi dokumen, dan pencarian cepat).</span>
                                </li>

                                <li className="relative flex items-start gap-4 py-2 before:absolute before:top-0 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>Pantau indikator dan realisasi untuk monitoring dan bukti dokumen.</span>
                                </li>
                            </ul>

                            {/* CTA */}
                            {auth.user ? (
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        Buka Dashboard
                                    </Link>

                                    <Link
                                        href="/rencana-strategis"
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                        Rencana Strategis
                                    </Link>

                                    <Link
                                        href="/kontrak-manajemen"
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal hover:border-[#1915014a] dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                                    >
                                        Kontrak Manajemen
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        Masuk
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: VISUAL */}
                        <div className="relative -mb-px flex aspect-[335/220] w-full shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
                            <div className="p-10 text-center">
                                {/* LOGO */}
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src="/logoo.svg"
                                        alt="Logo ARSIKA"
                                        className="h-20 w-20 opacity-70"
                                    />
                                </div>

                                <div className="text-3xl font-semibold tracking-tight text-[#F53003] dark:text-[#F61500]">
                                    ARSIKA
                                </div>
                                <div className="mt-2 text-sm text-[#1b1b18] opacity-70 dark:text-[#EDEDEC]">
                                    Arsip Kendali Mutu
                                </div>
                                <div className="mt-6 text-xs text-[#1b1b18] opacity-60 dark:text-[#EDEDEC]">
                                    Rencana Strategis | Kontrak Manajemen
                                </div>
                            </div>

                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>

                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    )
}
