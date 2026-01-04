import React, { useEffect, useMemo } from "react"
import { Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Printer, X } from "lucide-react"

type KmDetailRow = {
    id: number | string
    km_responsibility_id?: number | string
    tw_km?: string
    bobot_km?: string
    target_km?: string
    realisasi_km?: string
    nama_dokumen_km?: string | null
    url_dokumen_km?: string | null
    status?: string

    // fallback
    tw?: string
    bobot?: string
    target?: string
    realisasi?: string
    nama_dokumen?: string | null
    url_dokumen?: string | null
}

type ResponsibilityRow = {
    id: number | string
    responsibility: string
    kpi_spesifik: string
    unit: string
    tahun: string
    detail?: Array<KmDetailRow>
}

export default function KontrakManajemenPrint(props: {
    responsibilities?: ResponsibilityRow[]
    filters?: { q?: string; tahun?: string }
}) {
    const responsibilities = props.responsibilities ?? []
    const q = props.filters?.q ?? ""
    const tahun = props.filters?.tahun ?? ""

    const tahunLabel = useMemo(() => (tahun ? tahun : "Semua Tahun"), [tahun])

    useEffect(() => {
        const t = setTimeout(() => window.print(), 300)
        return () => clearTimeout(t)
    }, [])

    return (
        <>
            <Head title="Print Kontrak Manajemen" />

            <style>{`
        /* ===== SCREEN (ikut mode/theme) ===== */
        .km-print {
          min-height: 100vh;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        .km-card {
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 16px;
          background: hsl(var(--card));
        }
        .km-muted { color: hsl(var(--muted-foreground)); }

        .km-print table { width: 100%; border-collapse: collapse; }
        .km-print th, .km-print td {
          border: 1px solid hsl(var(--border));
          padding: 6px;
          vertical-align: top;
        }
        .km-print th { background: hsl(var(--muted)); font-weight: 700; }

        /* ===== PRINT (paksa hitam) ===== */
        @media print {
          html, body { background: #fff !important; }
          * { color: #000 !important; }

          .km-print, .km-print * {
            background: transparent !important;
            box-shadow: none !important;
          }

          .km-print th, .km-print td { border: 1px solid #000 !important; }
          .km-print th { background: #fff !important; }

          .no-print { display: none !important; }

          .break-after { page-break-after: always; }
        }
      `}</style>

            <div className="km-print p-6">
                {/* Toolbar */}
                <div className="no-print flex items-center justify-between mb-4">
                    <div className="text-sm km-muted">Page Print Kontrak Manajemen</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>
                        <Button variant="outline" onClick={() => window.close()}>
                            <X className="mr-2 h-4 w-4" />
                            Tutup
                        </Button>
                    </div>
                </div>

                {/* Header */}
                <div className="km-card mb-4">
                    <div className="text-xl font-semibold">Kontrak Manajemen</div>
                    <div className="text-sm km-muted mt-1">
                        Filter — Pencarian: <span className="font-medium">{q || "-"}</span> | Tahun:{" "}
                        <span className="font-medium">{tahunLabel}</span>
                    </div>
                </div>

                {/* Isi */}
                <div className="km-card">
                    {responsibilities.length === 0 ? (
                        <div>Tidak ada data.</div>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}>No</th>
                                    <th>Responsibility</th>
                                    <th>KPI Spesifik</th>
                                    <th style={{ width: 140 }}>Unit</th>
                                    <th style={{ width: 90 }}>Tahun</th>
                                </tr>
                            </thead>

                            <tbody>
                                {responsibilities.map((k, idx) => {
                                    const detail = k.detail ?? []

                                    return (
                                        <React.Fragment key={k.id}>
                                            <tr>
                                                <td>{idx + 1}</td>
                                                <td>{k.responsibility}</td>
                                                <td>{k.kpi_spesifik}</td>
                                                <td>{k.unit}</td>
                                                <td>{k.tahun}</td>
                                            </tr>

                                            {/* Detail: hanya TW, Bobot, Target, Realisasi */}
                                            <tr>
                                                <td colSpan={5}>
                                                    <div className="font-semibold mb-2">Detail</div>

                                                    {detail.length === 0 ? (
                                                        <div>Belum ada detail.</div>
                                                    ) : (
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ width: 60 }}>TW</th>
                                                                    <th style={{ width: 90 }}>Bobot</th>
                                                                    <th>Target</th>
                                                                    <th>Realisasi</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {detail.map((item) => {
                                                                    const tw = item.tw_km ?? item.tw ?? "-"
                                                                    const bobot = item.bobot_km ?? item.bobot ?? "-"
                                                                    const target = item.target_km ?? item.target ?? "-"
                                                                    const realisasi = item.realisasi_km ?? item.realisasi ?? "-"

                                                                    return (
                                                                        <tr key={item.id}>
                                                                            <td>{tw}</td>
                                                                            <td>{bobot}</td>
                                                                            <td>{target}</td>
                                                                            <td>{realisasi}</td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* opsional: tiap responsibility dipisah halaman saat print */}
                                            <tr className="break-after">
                                                <td colSpan={5} style={{ border: "none", padding: 0 }} />
                                            </tr>
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}
