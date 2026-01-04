import React, { useState, useEffect } from "react"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Head, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Pencil, Info, Trash, Plus, FileText, Download, Printer } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useFlashAlert } from "@/hooks/useFlashAlert";
import FormIndikator from "./form-indikator"
import OpsiIndikator from "./opsi-indikator"
import FormTambahTarget from "./form-tambah-detail"
import FormIsiCapaian from "./form-update-detail"
import OpsiDetail from "./opsi-detail"
import { router } from "@inertiajs/react"
import { Link } from "@inertiajs/react"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Rencana Strategis", href: "#" },
]

//export default function RencanaStrategis({ DaftarIndikator = [] }: { DaftarIndikator?: any[] }) {
export default function RencanaStrategis({ DaftarIndikator = [], filters }: { DaftarIndikator?: any[], filters?: any }) {
    const [openRow, setOpenRow] = useState<number | null>(null)
    const [editData, setEditData] = useState<any | null>(null)
    const [openCreate, setOpenCreate] = useState(false)
    const { flash } = usePage().props as any;
    const { FlashAlert } = useFlashAlert(flash, 3000);
    const [search, setSearch] = useState(filters?.search || "")
    const [openTarget, setOpenTarget] = useState<number | null>(null)

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route("rencana-strategis"), { search }, { preserveState: true, replace: true })
        }, 500)
        return () => clearTimeout(timeout)
    }, [search])

    const handlePrint = () => {
        window.print()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rencana Strategis" />
            {/* Print styles */}
            <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-area { padding: 0 !important; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 6px; }
          /* Sembunyikan kolom opsi saat print */
          .kolom-opsi, th.kolom-opsi { display: none !important; }
        }
      `}</style>

            <FlashAlert />
            <div className="p-4 print-area">
                <div className="flex justify-between items-center pb-4 gap-4 no-print">
                    <Input
                        type="text"
                        placeholder="Pencarian . . ."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Tambah Indikator
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <FormIndikator onSuccess={() => setOpenCreate(false)} />
                            </DialogContent>
                        </Dialog>
                        <Link
                            href={route("rencana-strategis.print", { search })}
                            target="_blank"
                            rel="noopener"
                        >
                            <Button variant="outline" type="button" className="no-print">
                                <Printer className="mr-2 h-4 w-4" />
                                Cetak
                            </Button>
                        </Link>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Main Program</th>
                            <th>Indikator</th>
                            <th>Bidang</th>
                            <th>Unit</th>
                            <th className="kolom-opsi no-print"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {DaftarIndikator.map((k, index) => (
                            <React.Fragment key={k.id}>
                                <tr
                                    className="cursor-pointer hover:text-red-500 border-b-2"
                                    onClick={() => setOpenRow(openRow === k.id ? null : k.id)}
                                >
                                    <td>{index + 1}</td>
                                    <td>{k.main_program}</td>
                                    <td>{k.indikator}</td>
                                    <td>{k.bidang}</td>
                                    <td>{k.tipe_data}</td>
                                    <td className="kolom-opsi no-print">
                                        <OpsiIndikator
                                            indikator={k}
                                            openRow={openRow}
                                            setOpenRow={setOpenRow}
                                            editData={editData}
                                            setEditData={setEditData}
                                        />
                                    </td>
                                </tr>

                                {openRow === k.id && (
                                    <tr className="table-detail">
                                        <td colSpan={6}>
                                            <div className="pb-2 no-print">
                                                {/* Tambah Target */}
                                                <Dialog open={openTarget === k.id} onOpenChange={(o) => setOpenTarget(o ? k.id : null)}>
                                                    <DialogTrigger asChild>
                                                        <Button>
                                                            <Plus className="mr-2 h-4 w-4" /> Tambah Target
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Tambah Target</DialogTitle>
                                                        </DialogHeader>
                                                        <FormTambahTarget indikatorId={k.id} onSuccess={() => setOpenTarget(null)} />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {k.detail && k.detail.length > 0 ? (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Tahun</th>
                                                            <th>Target</th>
                                                            <th>Capaian</th>
                                                            <th>Status</th>
                                                            <th className="kolom-opsi no-print"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {k.detail.map((item: any) => (
                                                            <tr key={item.id}>
                                                                <td>{item.tahun}</td>
                                                                <td>{item.target}</td>
                                                                <td>{item.capaian}</td>
                                                                <td><Badge>{item.status}</Badge></td>
                                                                <td className="flex gap-2 kolom-opsi no-print">
                                                                    {item.nama_dokumen ? (
                                                                        // jika ada dokumen > tombol unduh
                                                                        <Button asChild>
                                                                            <a href={route("detail.download", item.id)}>
                                                                                <Download />
                                                                            </a>
                                                                        </Button>
                                                                    ) : (
                                                                        // jika belum ada dokumen > tampilkan form isi capaian
                                                                        <Dialog>
                                                                            <DialogTrigger asChild>
                                                                                <Button>
                                                                                    <FileText />
                                                                                </Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent>
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Isi Capaian</DialogTitle>
                                                                                </DialogHeader>
                                                                                <FormIsiCapaian detailId={item.id} />
                                                                            </DialogContent>
                                                                        </Dialog>
                                                                    )}
                                                                    <OpsiDetail indikator={k} item={item} />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p className="text-gray-500">Belum ada target.</p>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    )
}
