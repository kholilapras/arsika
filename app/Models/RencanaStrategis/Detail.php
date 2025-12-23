<?php

namespace App\Models\RencanaStrategis;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Detail extends Model
{

    protected $table = 'renstra_detail';

    protected $fillable = [
        'renstra_indikator_id',
        'tahun',
        'target',
        'capaian',
        'status',
        'nama_dokumen',
        'url_dokumen',
    ];

    public function indikator(): BelongsTo
    {
        return $this->belongsTo(Indikator::class, 'renstra_indikator_id', 'id');
    }
}
