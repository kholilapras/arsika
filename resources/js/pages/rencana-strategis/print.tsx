import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// ===== Types =====
export type Detail = {
    id: number;
    tahun: string | number;
    target: string;
    capaian?: string | null;
    status?: string | null;
};

export type Indikator = {
    id: number;
    main_program: string;
    indikator: string;
    bidang: string;
    tipe_data: string; // unit
    details?: Detail[];
};

export default function PrintRencanaStrategis({
    DaftarIndikator = [],
    filters,
    printed_at,
}: {
    DaftarIndikator?: Indikator[];
    filters?: { search?: string; tahun?: number | string };
    printed_at?: string;
}) {
    const { auth } = usePage().props as any;

    // ======== Opsi Cetak (di halaman print) ========
    const [openPrint, setOpenPrint] = useState<boolean>(true);
    const [printMode, setPrintMode] = useState<"all" | "year">(filters?.tahun ? "year" : "all");
    const [selectedYear, setSelectedYear] = useState<string>(filters?.tahun ? String(filters.tahun) : "");
    const hasAutoPrinted = useRef(false);

    // Kumpulkan daftar tahun unik dari details yang ada
    const uniqueYears: string[] = useMemo(() => {
        const setY = new Set<string>();
        DaftarIndikator?.forEach((ind) => {
            ind?.details?.forEach((d) => {
                if (d?.tahun !== undefined && d?.tahun !== null) setY.add(String(d.tahun));
            });
        });
        return Array.from(setY).sort((a, b) => Number(a) - Number(b));
    }, [DaftarIndikator]);

    // Auto-print ketika sudah masuk dengan filter tahun (hindari preview kosong)
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (hasAutoPrinted.current) return;
        if (filters?.tahun === undefined || filters?.tahun === null) return;

        // Pastikan DOM benar2 sudah dirender oleh Inertia → duplikat rAF
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.print();
                hasAutoPrinted.current = true;
            });
        });
        setOpenPrint(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const applyAndPrint = () => {
        const params: Record<string, any> = {};

        if (filters?.search) params.search = filters.search;

        if (printMode === "year") {
            if (!selectedYear) return; // guard
            params.tahun = selectedYear; // kirim hanya jika mode tahun
        }
        // jika mode "all" → sengaja tidak kirim param tahun agar controller menganggap null

        router.get(route("rencana-strategis.print"), params, {
            replace: true,
            preserveScroll: true,
            onSuccess: () => {
                setOpenPrint(false);
                // Hindari blank print dengan double rAF setelah navigasi & render Inertia
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        window.print();
                    });
                });
            },
        });
    };

    return (
        <div className="p-6">
            <Head title="Cetak Rencana Strategis" />

            {/* ======== Print CSS: landscape + hitam putih ======== */}
            <style>{`
        @page { size: A4 landscape; margin: 12mm; }

        @media print {
          :root { color-scheme: light; }
          html, body { background: #fff !important; }

          /* Paksa semua konten hitam-putih */
          * {
            color: #000 !important;
            background: transparent !important;
            box-shadow: none !important;
            text-shadow: none !important;
            -webkit-print-color-adjust: economy;
            print-color-adjust: economy;
          }

          /* Tabel dan garis */
          table { width: 100%; border-collapse: collapse; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          th, td { border: 1px solid #000 !important; padding: 6px 8px; vertical-align: top; font-size: 12px; }

          /* Tabel detail di dalam sel */
          .detail-table { width: 100%; border-collapse: collapse; }
          .detail-table th, .detail-table td { border: 1px solid #000 !important; padding: 4px 6px; font-size: 11px; }

          /* Ikon SVG tetap terlihat (hitam) */
          svg, svg * { fill: #000 !important; stroke: #000 !important; }

          /* Hindari baris terbelah */
          .no-break { page-break-inside: avoid; }

          /* Sembunyikan dialog/elemen kontrol */
          .no-print { display: none !important; }
        }
      `}</style>

            {/*Dialog Opsi Cetak*/}
            <Dialog open={openPrint} onOpenChange={setOpenPrint}>
                <DialogContent className="no-print">
                    <DialogHeader>
                        <DialogTitle>Opsi Cetak</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <RadioGroup value={printMode} onValueChange={(v) => setPrintMode(v as "all" | "year")}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem id="pm-all" value="all" />
                                <Label htmlFor="pm-all">Cetak seluruh tahun</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem id="pm-year" value="year" />
                                <Label htmlFor="pm-year">Hanya tahun tertentu</Label>
                            </div>
                        </RadioGroup>

                        {printMode === "year" && (
                            <div className="space-y-2">
                                <Label>Pilih tahun</Label>
                                <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!uniqueYears.length}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={uniqueYears.length ? "Pilih tahun" : "Tidak ada data tahun"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueYears.map((y) => (
                                            <SelectItem key={y} value={y}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="secondary" onClick={() => setOpenPrint(false)}>Tutup</Button>
                            <Button onClick={applyAndPrint}>Terapkan & Cetak</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ======== Header Dokumen ======== */}
            <div className="mb-4 no-break">
                <h1 className="text-xl font-semibold">Rencana Strategis</h1>
                <div className="text-sm text-muted-foreground">
                    Dicetak: {printed_at ?? "-"}
                    {filters?.search ? <> · Filter teks: “{filters.search}”</> : null}
                    {filters?.tahun !== undefined && filters?.tahun !== null ? (
                        <> · Tahun: {filters.tahun}</>
                    ) : (
                        <> · Tahun: Semua</>
                    )}
                    
                </div>
            </div>

            {/* ======== Tabel Utama (detail di kanan setelah Unit) ======== */}
            <table>
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>No</th>
                        <th style={{ width: 220 }}>Main Program</th>
                        <th style={{ width: 320 }}>Indikator</th>
                        <th style={{ width: 160 }}>Bidang</th>
                        <th style={{ width: 120 }}>Unit</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {DaftarIndikator?.length ? (
                        DaftarIndikator.map((k, i) => (
                            <tr key={k.id} className="no-break">
                                <td>{i + 1}</td>
                                <td>{k.main_program}</td>
                                <td>{k.indikator}</td>
                                <td>{k.bidang}</td>
                                <td>{k.tipe_data}</td>
                                <td>
                                    {k.details && k.details.length > 0 ? (
                                        <table className="detail-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 80 }}>Tahun</th>
                                                    <th>Target</th>
                                                    <th>Capaian</th>
                                                    <th style={{ width: 110 }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {k.details.map((d) => (
                                                    <tr key={d.id}>
                                                        <td>{d.tahun}</td>
                                                        <td>{d.target}</td>
                                                        <td>{d.capaian ?? "-"}</td>
                                                        <td>{d.status ?? "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <span className="text-sm">Belum ada detail.</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">Tidak ada data</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="text-xs text-muted-foreground mt-3">
                * Dokumen ini dihasilkan otomatis oleh sistem pada {printed_at ?? "-"} {auth?.user?.name ? <> | Oleh: {auth.user.name}</> : null}
            </div>

            {/* Fallback bila JS dimatikan */}
            <noscript>
                <div style={{ marginTop: 12, fontSize: 12 }}>
                    Untuk mencetak, gunakan menu browser: File → Print / Ctrl+P.
                </div>
            </noscript>
        </div>
    );
}
