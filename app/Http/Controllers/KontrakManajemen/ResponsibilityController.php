<?php

namespace App\Http\Controllers\KontrakManajemen;

use App\Http\Controllers\Controller;
use App\Models\KontrakManajemen\Responsibility;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResponsibilityController extends Controller
{
    public function index(Request $request)
    {
        [$q, $tahun] = $this->getFilters($request);

        $availableYears = $this->getAvailableYears();

        $responsibilities = $this->getResponsibilities($q, $tahun, includeTimestamps: true);

        return Inertia::render('kontrak-manajemen/index', [
            'responsibilities' => $responsibilities,
            'availableYears' => $availableYears,
            'filters' => [
                'q' => $q,
                'tahun' => $tahun,
            ],
        ]);
    }

    public function print(Request $request)
    {
        [$q, $tahun] = $this->getFilters($request);

        $responsibilities = $this->getResponsibilities($q, $tahun, includeTimestamps: false);

        return Inertia::render('kontrak-manajemen/print', [
            'responsibilities' => $responsibilities,
            'filters' => [
                'q' => $q,
                'tahun' => $tahun,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'responsibility' => ['required', 'string', 'max:255'],
            'kpi_spesifik'   => ['required', 'string', 'max:255'],
            'unit'           => ['required', 'string', 'max:255'],
            'tahun'          => ['required', 'integer', 'between:2000,2100'],
        ]);

        Responsibility::create([
            'responsibility_km' => $data['responsibility'],
            'kpi_spesifik_km'   => $data['kpi_spesifik'],
            'unit_km'           => $data['unit'],
            'tahun_km'          => $data['tahun'],
        ]);

        return back()->with('success', 'Responsibility berhasil ditambahkan.');
    }

    public function update(Request $request, Responsibility $responsibility)
    {
        $data = $request->validate([
            'responsibility' => ['required', 'string', 'max:255'],
            'kpi_spesifik'   => ['required', 'string', 'max:255'],
            'unit'           => ['required', 'string', 'max:255'],
            'tahun'          => ['required', 'integer', 'between:2000,2100'],
        ]);

        $responsibility->update([
            'responsibility_km' => $data['responsibility'],
            'kpi_spesifik_km'   => $data['kpi_spesifik'],
            'unit_km'           => $data['unit'],
            'tahun_km'          => $data['tahun'],
        ]);

        return back()->with('success', 'Responsibility berhasil diperbarui.');
    }

    public function destroy(Responsibility $responsibility)
    {
        $responsibility->delete();

        return back()->with('success', 'Responsibility berhasil dihapus.');
    }

    // =========================
    // Helpers
    // =========================

    private function getFilters(Request $request): array
    {
        $q = trim((string) $request->input('q', ''));

        $tahun = trim((string) $request->input('tahun', ''));
        if ($tahun === 'all') {
            $tahun = '';
        }

        return [$q, $tahun];
    }

    private function getAvailableYears()
    {
        return Responsibility::query()
            ->select('tahun_km')
            ->whereNotNull('tahun_km')
            ->distinct()
            ->orderByDesc('tahun_km')
            ->pluck('tahun_km')
            ->map(fn($t) => (string) $t)
            ->values();
    }

    private function getResponsibilities(string $q, string $tahun, bool $includeTimestamps = true)
    {
        $query = Responsibility::query()
            ->when($q !== '', function ($query) use ($q) {
                $like = "%{$q}%";
                $query->where(function ($qq) use ($like) {
                    $qq->where('responsibility_km', 'like', $like)
                        ->orWhere('kpi_spesifik_km', 'like', $like)
                        ->orWhere('unit_km', 'like', $like)
                        ->orWhere('tahun_km', 'like', $like);
                });
            })
            ->when($tahun !== '', function ($query) use ($tahun) {
                $query->where('tahun_km', $tahun);
            })
            ->with(['details' => function ($q) {
                $q->orderByRaw("
                    CASE
                        WHEN tw_km = 'TW 1' THEN 1
                        WHEN tw_km = 'TW 2' THEN 2
                        WHEN tw_km = 'TW 3' THEN 3
                        WHEN tw_km = 'TW 4' THEN 4
                        ELSE 99
                    END
                ");
            }])
            ->orderByDesc('tahun_km')
            ->orderByDesc('id');

        return $query->get()
            ->map(function ($r) use ($includeTimestamps) {
                $row = [
                    'id' => $r->id,
                    'responsibility' => $r->responsibility_km,
                    'kpi_spesifik' => $r->kpi_spesifik_km,
                    'unit' => $r->unit_km,
                    'tahun' => (string) $r->tahun_km,
                    'detail' => $r->details->map(function ($d) use ($includeTimestamps) {
                        $item = [
                            'id' => $d->id,
                            'km_responsibility_id' => $d->km_responsibility_id,
                            'tw_km' => $d->tw_km,
                            'bobot_km' => $d->bobot_km,
                            'target_km' => $d->target_km,
                            'realisasi_km' => $d->realisasi_km,
                            'nama_dokumen_km' => $d->nama_dokumen_km,
                            'url_dokumen_km' => $d->url_dokumen_km,
                            'status' => $d->status ?? null,
                        ];

                        if ($includeTimestamps) {
                            $item['created_at'] = $d->created_at?->toISOString();
                            $item['updated_at'] = $d->updated_at?->toISOString();
                        }

                        return $item;
                    })->values(),
                ];

                if ($includeTimestamps) {
                    $row['created_at'] = $r->created_at?->toISOString();
                    $row['updated_at'] = $r->updated_at?->toISOString();
                }

                return $row;
            })
            ->values();
    }
}
