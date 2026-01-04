import React, { useEffect, useMemo, useState } from "react"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Head, router, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Download, Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFlashAlert } from "@/hooks/useFlashAlert"

import FormResponsibility from "./form-responsibility"
import OpsiResponsibility from "./opsi-responsibility"
import FormTambahDetail from "./form-tambah-detail"
import FormIsiRealisasi from "./form-update-detail"
import OpsiDetail from "./opsi-detail"

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

  // fallback (kalau backend kirim tanpa suffix)
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
  created_at?: string
  updated_at?: string
  detail?: Array<KmDetailRow>
}

const breadcrumbs: BreadcrumbItem[] = [{ title: "Kontrak Manajemen", href: "#" }]

export default function KontrakManajemen(props: {
  responsibilities?: ResponsibilityRow[]
  availableYears?: string[]
  filters?: { q?: string; tahun?: string }
}) {
  const responsibilities = props.responsibilities ?? []
  const availableYears = props.availableYears ?? []
  const filters = props.filters

  // ✅ Flash alert (seperti Rencana Strategis)
  const { flash } = usePage().props as any
  const { FlashAlert } = useFlashAlert(flash, 3000)

  const [openRow, setOpenRow] = useState<number | string | null>(null)

  // dialog create responsibility
  const [openCreate, setOpenCreate] = useState(false)
  const [editData, setEditData] = useState<ResponsibilityRow | null>(null)

  // filter state
  const [q, setQ] = useState(filters?.q ?? "")
  const [tahun, setTahun] = useState(filters?.tahun ? String(filters.tahun) : "all")

  // dialog tambah detail per row
  const [openDetailCreate, setOpenDetailCreate] = useState<number | string | null>(null)

  const tahunOptions = useMemo(() => {
    const uniq = Array.from(new Set(availableYears.map(String))).filter(Boolean)
    return uniq.sort((a, b) => Number(b) - Number(a))
  }, [availableYears])

  // toggle row detail
  const toggleRow = (id: number | string) => {
    setOpenRow((prev) => (prev === id ? null : id))
  }

  // AUTO FILTER tanpa klik cari (debounce 500ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.get(
        route("kontrak-manajemen"),
        {
          q: q || "",
          tahun: tahun === "all" ? "" : tahun,
        },
        {
          preserveState: true,
          replace: true,
          preserveScroll: true,
        }
      )
    }, 500)

    return () => clearTimeout(timeout)
  }, [q, tahun])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kontrak Manajemen" />

      {/* ✅ tampilkan notifikasi flash */}
      <FlashAlert />

      {/* Print style */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { padding: 0 !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 6px; }
          .kolom-opsi, th.kolom-opsi { display: none !important; }
        }
      `}</style>

      <div className="p-4 print-area">
        {/* Header filter */}
        <div className="flex justify-between items-center gap-4 pb-4 no-print">
          {/* kiri: search + filter tahun */}
          <div className="flex gap-2 w-full items-center">
            <Input
              type="text"
              placeholder="Pencarian..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <div className="min-w-[180px]">
              <Select value={tahun} onValueChange={setTahun}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {tahunOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* kanan: tombol print + tambah */}
          <div className="flex items-center gap-2">
            {/* PRINT PAGE */}
            <Button asChild variant="outline">
              <a
                href={route("kontrak-manajemen.print", {
                  q: q || "",
                  tahun: tahun === "all" ? "" : tahun,
                })}
                target="_blank"
                rel="noreferrer"
              >
                <Printer className="mr-2 h-4 w-4" />
                Cetak
              </a>
            </Button>

            {/* Tambah Responsibility */}
            <Dialog
              open={openCreate}
              onOpenChange={(o) => {
                setOpenCreate(o)
                if (!o) setEditData(null)
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Responsibility
                </Button>
              </DialogTrigger>

              <DialogContent>
                <FormResponsibility onSuccess={() => setOpenCreate(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabel utama */}
        <table className="w-full">
          <thead>
            <tr>
              <th style={{ width: 70 }}>No</th>
              <th>Responsibility</th>
              <th>KPI Spesifik</th>
              <th>Unit</th>
              <th>Tahun</th>
              <th className="kolom-opsi no-print"></th>
            </tr>
          </thead>

          <tbody>
            {responsibilities.length === 0 ? (
              <tr>
                <td colSpan={6}>Tidak ada data.</td>
              </tr>
            ) : (
              responsibilities.map((k, idx) => {
                const detail = k.detail ?? []
                const isOpen = openRow === k.id

                return (
                  <React.Fragment key={k.id}>
                    {/* Row parent */}
                    <tr
                      className="cursor-pointer hover:text-red-500 border-b-2"
                      onClick={() => toggleRow(k.id)}
                    >
                      <td className="select-none">
                        <span className="inline-flex items-center gap-2">
                          <span>{idx + 1}</span>
                        </span>
                      </td>

                      <td>{k.responsibility}</td>
                      <td>{k.kpi_spesifik}</td>
                      <td>{k.unit}</td>
                      <td>{k.tahun}</td>

                      {/* Opsi parent */}
                      <td
                        className="kolom-opsi no-print"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <OpsiResponsibility
                          responsibility={k}
                          openRow={openRow}
                          setOpenRow={setOpenRow}
                          editData={editData}
                          setEditData={setEditData}
                        />
                      </td>
                    </tr>

                    {/* Row detail */}
                    {isOpen && (
                      <tr className="table-detail">
                        <td colSpan={6}>
                          <div className="pb-2 flex items-center justify-between no-print">
                            <Label className="text-sm">Detail</Label>

                            <Dialog
                              open={openDetailCreate === k.id}
                              onOpenChange={(o) => setOpenDetailCreate(o ? k.id : null)}
                            >
                              <DialogTrigger asChild>
                                <Button>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Tambah Detail
                                </Button>
                              </DialogTrigger>

                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Tambah Detail</DialogTitle>
                                </DialogHeader>

                                <FormTambahDetail
                                  responsibilityId={k.id}
                                  onSuccess={() => setOpenDetailCreate(null)}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>

                          {detail.length > 0 ? (
                            <table className="w-full">
                              <thead>
                                <tr>
                                  <th>TW</th>
                                  <th>Bobot</th>
                                  <th>Target</th>
                                  <th>Realisasi</th>
                                  <th>Status</th>
                                  <th className="kolom-opsi no-print"></th>
                                </tr>
                              </thead>

                              <tbody>
                                {detail.map((item) => {
                                  const tw = item.tw_km ?? item.tw ?? "-"
                                  const bobot = item.bobot_km ?? item.bobot ?? "-"
                                  const target = item.target_km ?? item.target ?? "-"
                                  const realisasi = item.realisasi_km ?? item.realisasi ?? "-"

                                  const namaDok = item.nama_dokumen_km ?? item.nama_dokumen
                                  const status =
                                    item.status ?? (namaDok ? "Dokumen Terunggah" : "Belum Upload")

                                  return (
                                    <tr key={item.id}>
                                      <td>{tw}</td>
                                      <td>{bobot}</td>
                                      <td>{target}</td>
                                      <td>{realisasi}</td>
                                      <td>
                                        <Badge
                                          variant={status === "Belum Upload" ? "secondary" : "default"}
                                          className={
                                            status === "Belum Upload"
                                              ? "bg-gray-200 text-gray-700"
                                              : ""
                                          }
                                        >
                                          {status}
                                        </Badge>
                                      </td>

                                      {/* ✅ FIX: td JANGAN flex. Bungkus flex di dalam div */}
                                      <td
                                        className="kolom-opsi no-print"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <div className="flex items-center gap-2">
                                          {namaDok ? (
                                            <Button asChild variant="outline" size="icon">
                                              <a href={route("kontrak-manajemen.detail.download", item.id)}>
                                                <Download className="h-4 w-4" />
                                              </a>
                                            </Button>
                                          ) : (
                                            <Dialog>
                                              <DialogTrigger asChild>
                                                <Button variant="secondary" size="icon">
                                                  <FileText className="h-4 w-4" />
                                                </Button>
                                              </DialogTrigger>
                                              <DialogContent>
                                                <DialogHeader>
                                                  <DialogTitle>Isi Realisasi</DialogTitle>
                                                </DialogHeader>

                                                <FormIsiRealisasi detailId={item.id} detail={item} />
                                              </DialogContent>
                                            </Dialog>
                                          )}

                                          <OpsiDetail responsibility={k} item={item} />
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-gray-500">Belum ada detail.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}
