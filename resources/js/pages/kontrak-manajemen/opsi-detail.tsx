import React from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, MoreVertical, Info } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from "@inertiajs/react"

import FormIsiRealisasi from "./form-update-detail"
import formatTanggal from "../../utils/formatTanggal"

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

  created_at?: string
  updated_at?: string

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
}

type OpsiDetailProps = {
  responsibility: ResponsibilityRow
  item: KmDetailRow
}

export default function OpsiDetail({ responsibility, item }: OpsiDetailProps) {
  const { delete: destroy, processing } = useForm()

  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [infoOpen, setInfoOpen] = React.useState(false)

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      {/* EDIT DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Detail</DialogTitle>
          </DialogHeader>

          <FormIsiRealisasi detailId={item.id} detail={item} />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* INFO DIALOG */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Info Detail</DialogTitle>
          </DialogHeader>

          <p>
            <strong>Dibuat : </strong>{" "}
            {item.created_at ? formatTanggal(item.created_at) : "-"}
          </p>
          <p>
            <strong>Diperbarui : </strong>{" "}
            {item.updated_at ? formatTanggal(item.updated_at) : "-"}
          </p>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Detail</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            Apakah Anda yakin ingin menghapus detail (TW:{" "}
            <strong>{item.tw_km ?? item.tw ?? "-"}</strong>) tahun{" "}
            <strong>{responsibility.tahun}</strong>?
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={processing}>
                Batal
              </Button>
            </DialogClose>

            <Button
              disabled={processing}
              onClick={() =>
                destroy(route("kontrak-manajemen.detail.destroy", item.id), {
                  preserveScroll: true,
                  onSuccess: () => setDeleteOpen(false),
                })
              }
            >
              {processing ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DROPDOWN MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => e.stopPropagation()}
            aria-label="Opsi Detail"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setEditOpen(true)
            }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Detail
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setInfoOpen(true)
            }}
          >
            <Info className="mr-2 h-4 w-4" />
            Info
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault()
              setDeleteOpen(true)
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Hapus Detail
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
