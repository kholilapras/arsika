<?php

namespace App\Models\KontrakManajemen;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Detail extends Model
{
    protected $table = 'km_detail';

    protected $fillable = [
        'km_responsibility_id',
        'tw_km',
        'bobot_km',
        'target_km',
        'realisasi_km',
        'nama_dokumen_km',
        'url_dokumen_km',
    ];

    public function responsibility(): BelongsTo
    {
        return $this->belongsTo(Responsibility::class, 'km_responsibility_id', 'id');
    }
}
