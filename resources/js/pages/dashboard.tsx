import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, List, ListCheck, BarChart3, CalendarDays } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }]

type YearStat = {
    tahun: string
    rencanaStrategis?: { indikator?: number }
    kontrakManajemen?: { responsibility?: number }
}

type PageProps = {
    auth?: { user?: { name?: string } }
    statsByYear?: YearStat[]
}

export default function Dashboard() {
    const { props } = usePage<PageProps>()

    const userName = props?.auth?.user?.name ?? 'Pengguna'
    const tanggal = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date())

    const statsByYear = props?.statsByYear ?? []
    const fmt = (n: number) => n.toLocaleString('id-ID')

    const totals = statsByYear.reduce(
        (acc, row) => {
            acc.rsIndikator += row?.rencanaStrategis?.indikator ?? 0
            acc.kmResp += row?.kontrakManajemen?.responsibility ?? 0
            return acc
        },
        { rsIndikator: 0, kmResp: 0 },
    )

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Selamat Datang (lebih berwarna, tanpa border) */}
                <Card className="border-0 shadow-none bg-gradient-to-r from-muted/70 via-muted/40 to-background dark:from-muted/30 dark:via-muted/20 dark:to-background">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CardTitle className="text-base">
                                    Selamat datang, <span className="font-bold">{userName}</span>
                                </CardTitle>
                            </div>

                            {/* tanggal pojok kanan atas tanpa border */}
                            <div className="inline-flex items-center gap-2 rounded-lg bg-background/60 dark:bg-background/30 px-3 py-2 text-xs text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                <span className="font-medium text-foreground">{tanggal}</span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Menu */}
                <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-muted/20 dark:bg-muted/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Menu</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2">
                            <Link href="/rencana-strategis" className="block">
                                <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-background hover:bg-muted/20 dark:bg-background/40 dark:hover:bg-muted/10 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-muted/60 dark:bg-muted/30 flex items-center justify-center">
                                                    <List className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <div className="font-semibold">Rencana Strategis</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Kelola data indikator rencana strategis
                                                    </div>
                                                </div>
                                            </div>

                                            <Button variant="outline" className="rounded-xl">
                                                Buka <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>

                            <Link href="/kontrak-manajemen" className="block">
                                <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-background hover:bg-muted/20 dark:bg-background/40 dark:hover:bg-muted/10 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-muted/60 dark:bg-muted/30 flex items-center justify-center">
                                                    <ListCheck className="h-5 w-5" />
                                                </div>

                                                <div>
                                                    <div className="font-semibold">Kontrak Manajemen</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Kelola responsibility kontrak manajemen
                                                    </div>
                                                </div>
                                            </div>

                                            <Button variant="outline" className="rounded-xl">
                                                Buka <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Ringkasan Total (pakai background tint) */}
                <div className="grid gap-3 md:grid-cols-2">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-muted/30 dark:bg-muted/15">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Total Rencana Strategis</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-3xl font-bold">{fmt(totals.rsIndikator)}</div>
                            <p className="mt-1 text-sm text-muted-foreground">Total indikator dari semua tahun</p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-muted/30 dark:bg-muted/15">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Total Kontrak Manajemen</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="text-3xl font-bold">{fmt(totals.kmResp)}</div>
                            <p className="mt-1 text-sm text-muted-foreground">Total responsibility dari semua tahun</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistik per Tahun (Card lebih variatif) */}
                <Card className="border-sidebar-border/70 dark:border-sidebar-border bg-muted/20 dark:bg-muted/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg inline-flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Statistik per Tahun
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {statsByYear.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Belum ada data statistik di database.</p>
                        ) : (
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {statsByYear.map((row) => {
                                    const rsI = row?.rencanaStrategis?.indikator ?? 0
                                    const kmR = row?.kontrakManajemen?.responsibility ?? 0

                                    return (
                                        <Card
                                            key={row.tahun}
                                            className="border-sidebar-border/70 dark:border-sidebar-border bg-background/70 dark:bg-background/30"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between gap-3">
                                                    <CardTitle className="text-base">Tahun {row.tahun}</CardTitle>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="rounded-xl bg-muted/30 dark:bg-muted/15 p-3">
                                                        <div className="text-xs text-muted-foreground">Rencana Strategis</div>
                                                        <div className="text-[11px] text-muted-foreground">Indikator</div>
                                                        <div className="mt-1 text-2xl font-bold">{fmt(rsI)}</div>
                                                    </div>

                                                    <div className="rounded-xl bg-muted/30 dark:bg-muted/15 p-3">
                                                        <div className="text-xs text-muted-foreground">Kontrak Manajemen</div>
                                                        <div className="text-[11px] text-muted-foreground">Responsibility</div>
                                                        <div className="mt-1 text-2xl font-bold">{fmt(kmR)}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
