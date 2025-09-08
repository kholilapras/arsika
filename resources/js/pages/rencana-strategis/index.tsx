import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Pencil, Info, Trash, Plus, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"
import ChevronToggle from "@/components/ui/chevron-toggle";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Rencana Strategis", href: "#" },
];

const kelompokKeahlian = [
    {
        id: 1,
        main_program: "Invest In People",
        indikator: "Jumlah prodi terakreditasi Unggul / A",
        bidang: "DIR TUP",
        tipe_data: "Angka",
        detail: [
            { id: 1, tahun: "2024", target: 2, capaian: 1, status: "50%", dokumen: "link_dokumen_2024.pdf" },
            { id: 2, tahun: "2025", target: 4, capaian: 6, status: "150%", dokumen: "" },
        ],
    },
    {
        id: 2,
        main_program: "Digital transformation",
        indikator: "Penerapan TUNC Intelligent Campus (LMS, iGracias, TUP dosen dan staf, Satu Data dan Analytic",
        bidang: "WADIR I TUP, PRODI TUP",
        tipe_data: "Persentase",
        detail: [
            { id: 1, tahun: "2024", target: "20%", capaian: "-", status: "-", dokumen: "publikasi2024.pdf" },
            { id: 2, tahun: "2025", target: "25%", capaian: "-", status: "-", dokumen: "" },
        ],
    },
];


export default function RencanaStrategis() {
    const [openRow, setOpenRow] = useState<number | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rencana Strategis" />
            <div className="p-4">
                <div className="flex justify-between items-center pb-4 gap-4">
                    <Input
                        type="text"
                        placeholder="Cari Main Program/Sasaran Strategis/IKU/Indikator/Penanggung Jawab"
                    />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button><Plus />Tambah Indikator</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Form Indikator</DialogTitle></DialogHeader>
                            <Label>Main Program</Label>
                            <Input />
                            <Label>Indikator</Label>
                            <Textarea />
                            <Label>Bidang</Label>
                            <Input
                            />
                            <Label>Tipe Data</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="1">Angka</SelectItem>
                                        <SelectItem value="2">Persentase</SelectItem>
                                        <SelectItem value="3">Rasio</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Batal</Button>
                                </DialogClose>
                                <Button type="submit">Simpan</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Main Program</th>
                            <th>Indikator</th>
                            <th>Bidang</th>
                            <th>Tipe Data</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {kelompokKeahlian.map((k) => (
                            <React.Fragment key={k.id}>
                                {/* Row utama */}
                                <tr
                                    className="cursor-pointer hover:text-red-500 border-b-2"
                                    onClick={() => setOpenRow(openRow === k.id ? null : k.id)}
                                >
                                    <td>{k.id}</td>
                                    <td>{k.main_program}</td>
                                    <td>{k.indikator}</td>
                                    <td>{k.bidang}</td>
                                    <td>{k.tipe_data}</td>
                                    <td className="kolom-opsi">
                                        <Button variant="secondary"><Info /></Button>
                                        <Link href="#edit">
                                            <Button variant="secondary"><Pencil /></Button>
                                        </Link>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="secondary"><Trash /></Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                                </DialogHeader>
                                                <DialogDescription>
                                                    Apakah Anda yakin ingin menghapus <strong>{k.indikator} </strong> ?
                                                </DialogDescription>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Batal</Button>
                                                    </DialogClose>
                                                    <Button>Hapus</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <ChevronToggle open={openRow === k.id} />
                                    </td>

                                </tr>

                                {/* Row detail collapse */}
                                {openRow === k.id && (
                                    <tr className="table-detail">
                                        <td colSpan={6}>
                                            <div className="pb-2">
                                                <Dialog>
                                                    <form>
                                                        <DialogTrigger asChild>
                                                            <Button><Plus />Tambah Target</Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Tambah Target</DialogTitle>
                                                            </DialogHeader>
                                                            <Label>Tahun</Label>
                                                            <Input
                                                                type="number"
                                                            />
                                                            <Label>Target</Label>
                                                            <Input
                                                            />
                                                            <DialogFooter>
                                                                <DialogClose asChild>
                                                                    <Button variant="outline">Batal</Button>
                                                                </DialogClose>
                                                                <Button type="submit">Simpan</Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </form>
                                                </Dialog>
                                            </div>
                                            {k.indikator.length > 0 ? (
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Tahun</th>
                                                            <th>Target</th>
                                                            <th>Capaian</th>
                                                            <th>Status</th>
                                                            <th>Dokumen</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {k.detail.map((item, i) => (
                                                            <tr key={item.id}>
                                                                <td>{item.tahun}</td>
                                                                <td>{item.target}</td>
                                                                <td>{item.capaian}</td>
                                                                <td><Badge>{item.status}</Badge></td>
                                                                <td>{item.dokumen}</td>
                                                                <td className="kolom-opsi">
                                                                    <Dialog>
                                                                        <form>
                                                                            <DialogTrigger asChild>
                                                                                <Button><FileText />Isi Capaian</Button>
                                                                            </DialogTrigger>
                                                                            <DialogContent>
                                                                                <DialogHeader>
                                                                                    <DialogTitle>Isi Capaian</DialogTitle>
                                                                                </DialogHeader>
                                                                                <Label>Bukti Dokumen <p className="text-sm text-muted-foreground">Hanya dokumen .pdf yang diizinkan</p></Label>
                                                                                <Input
                                                                                    type="file"
                                                                                    accept="application/pdf"
                                                                                />
                                                                                <Label>Capaian</Label>
                                                                                <Input
                                                                                />
                                                                                <DialogFooter>
                                                                                    <DialogClose asChild>
                                                                                        <Button variant="outline">Batal</Button>
                                                                                    </DialogClose>
                                                                                    <Button type="submit">Simpan</Button>
                                                                                </DialogFooter>
                                                                            </DialogContent>
                                                                        </form>
                                                                    </Dialog>
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button variant="secondary"><Trash /></Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                                                                            </DialogHeader>
                                                                            <DialogDescription>
                                                                                Apakah Anda yakin ingin menghapus <strong>{k.indikator} tahun {item.tahun} </strong> ?
                                                                            </DialogDescription>
                                                                            <DialogFooter>
                                                                                <DialogClose asChild>
                                                                                    <Button variant="outline">Batal</Button>
                                                                                </DialogClose>
                                                                                <Button>Hapus</Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : (
                                                <p>Belum ada indikator.</p>
                                            )}
                                        </td>

                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout >
    );
}
