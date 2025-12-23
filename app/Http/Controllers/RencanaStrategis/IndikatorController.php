<?php

namespace App\Http\Controllers\RencanaStrategis;

use App\Http\Controllers\Controller;
use App\Models\RencanaStrategis\Indikator;
use Inertia\Inertia;
use Illuminate\Http\Request;

class IndikatorController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $indikator = Indikator::query()
            // eager load details + urutkan tahun ASC
            ->with(['details' => function ($q) {
                $q->orderBy('tahun', 'asc');
            }])
            // filter pencarian
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('main_program', 'like', "%{$search}%")
                        ->orWhere('indikator',    'like', "%{$search}%")
                        ->orWhere('bidang',       'like', "%{$search}%")
                        ->orWhere('tipe_data',    'like', "%{$search}%");
                });
            })
            // urutan ASC: main_program → indikator → bidang → tipe_data (unit)
            ->orderBy('main_program', 'asc')
            ->orderBy('indikator', 'asc')
            ->orderBy('bidang', 'asc')
            ->orderBy('tipe_data', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id'           => $item->id,
                    'main_program' => $item->main_program,
                    'indikator'    => $item->indikator,
                    'bidang'       => $item->bidang,
                    'tipe_data'    => $item->tipe_data,
                    'created_at'   => $item->created_at,
                    'updated_at'   => $item->updated_at,
                    'detail'       => $item->details->map(function ($detail) {
                        return [
                            'id'           => $detail->id,
                            'tahun'        => $detail->tahun,
                            'target'       => $detail->target,
                            'capaian'      => $detail->capaian,
                            'status'       => $detail->status,
                            'nama_dokumen' => $detail->nama_dokumen,
                            'url_dokumen'  => $detail->url_dokumen,
                            'created_at'   => $detail->created_at,
                            'updated_at'   => $detail->updated_at,
                        ];
                    }),
                ];
            });

        return Inertia::render('rencana-strategis/index', [
            'DaftarIndikator' => $indikator,
            'filters'         => ['search' => $search],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'main_program' => 'required|string|max:255',
            'indikator'    => 'required|string',
            'bidang'       => 'required|string|max:255',
            'tipe_data'    => 'required|string|max:255',
        ]);

        Indikator::create($validated);

        return redirect()->route('rencana-strategis')
            ->with('success', 'Indikator berhasil ditambahkan.');
    }

    public function update(Request $request, Indikator $indikator)
    {
        $validated = $request->validate([
            'main_program' => 'required|string|max:255',
            'indikator'    => 'required|string',
            'bidang'       => 'required|string|max:255',
            'tipe_data'    => 'required|string|max:255',
        ]);

        $indikator->update($validated);

        return redirect()->route('rencana-strategis')
            ->with('success', 'Indikator berhasil diperbarui.');
    }

    public function destroy(Indikator $indikator)
    {
        $indikator->delete();

        return redirect()->route('rencana-strategis')
            ->with('success', 'Indikator berhasil dihapus.');
    }

    public function print(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'search' => ['nullable', 'string'],
            'tahun'  => ['nullable', 'integer'],
        ]);

        $search = (string) ($validated['search'] ?? '');
        // Pakai has() agar "0" tetap terdeteksi
        $tahun  = $request->has('tahun') ? $request->integer('tahun') : null;

        $daftar = Indikator::query()
            ->when(
                $search !== '',
                fn($q) => $q->where(
                    fn($qq) =>
                    $qq->where('main_program', 'like', "%{$search}%")
                        ->orWhere('indikator',    'like', "%{$search}%")
                        ->orWhere('bidang',       'like', "%{$search}%")
                        ->orWhere('tipe_data',    'like', "%{$search}%")
                )
            )
            // Eager load details; batasi by tahun jika dipilih + urutkan tahun ASC
            ->with(['details' => function ($q) use ($tahun) {
                if ($tahun !== null) {
                    $q->where('tahun', $tahun);
                }
                $q->orderBy('tahun', 'asc');
            }])
            // Jika tahun dipilih, hanya ambil indikator yang punya detail di tahun tsb
            ->when(
                $tahun !== null,
                fn($q) => $q->whereHas('details', fn($qq) => $qq->where('tahun', $tahun))
            )
            // urutan ASC: main_program → indikator → bidang → tipe_data (unit)
            ->orderBy('main_program', 'asc')
            ->orderBy('indikator', 'asc')
            ->orderBy('bidang', 'asc')
            ->orderBy('tipe_data', 'asc')
            ->get();

        return Inertia::render('rencana-strategis/print', [
            'DaftarIndikator' => $daftar,
            'filters'         => ['search' => $search, 'tahun' => $tahun],
            'printed_at'      => now()->timezone(config('app.timezone') ?? 'Asia/Jakarta')->format('d/m/Y H:i'),
        ]);
    }
}
