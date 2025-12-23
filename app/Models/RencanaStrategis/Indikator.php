<?php

namespace App\Models\RencanaStrategis;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\RencanaStrategis\Detail;

class Indikator extends Model
{

    protected $table = 'renstra_indikator';

    protected $fillable = [
        'main_program',
        'indikator',
        'bidang',
        'tipe_data',
    ];

    public function details(): HasMany
    {
        // FK = renstra_indikator_id, PK lokal = id
        return $this->hasMany(Detail::class, 'renstra_indikator_id', 'id')
            ->orderBy('tahun');
    }
}
