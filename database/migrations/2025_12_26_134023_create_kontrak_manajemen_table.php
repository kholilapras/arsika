<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('km_responsibility', function (Blueprint $table) {
            $table->id();
            $table->string('responsibility_km');
            $table->string('kpi_spesifik_km');
            $table->string('unit_km');
            $table->string('tahun_km');
            $table->timestamps();
        });

        Schema::create('km_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('km_responsibility_id')
                ->constrained('km_responsibility')
                ->onDelete('cascade');
            $table->string('tw_km');
            $table->string('bobot_km');
            $table->string('target_km');
            $table->string('realisasi_km');
            $table->string('nama_dokumen_km')->nullable();
            $table->string('url_dokumen_km')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('km_responsibility');
        Schema::dropIfExists('km_detail');
    }
};
