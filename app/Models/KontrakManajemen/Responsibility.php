<?php

namespace App\Models\KontrakManajemen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\KontrakManajemen\Detail;

class Responsibility extends Model
{

    protected $table = 'km_responsibility';

    protected $fillable = [
        'responsibility_km',
        'kpi_spesifik_km',
        'unit_km',
        'tahun_km',
    ];

    // public function details(): HasMany
    // {
    //     // FK = renstra_indikator_id, PK lokal = id
    //     return $this->hasMany(Detail::class, 'renstra_indikator_id', 'id')
    //         ->orderBy('tahun');
    // }

    public function details(): HasMany
    {
        return $this->hasMany(Detail::class, 'km_responsibility_id', 'id')
            ->orderBy('tw_km');
    }
}
