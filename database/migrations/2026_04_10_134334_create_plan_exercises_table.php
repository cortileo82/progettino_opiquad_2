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
        Schema::create('plan_exercises', function (Blueprint $table) {
            $table->id();

            // Relazione con la tabella plans (Schede)
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');

            // Relazione con la tabella exercises (Esercizi)
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');

            // Giorno della settimana (es. "Lunedì" o un numero da 1 a 7)
            $table->string('day_of_week'); 

            // Settimana della scheda
            $table->integer('week_number')->after('exercise_id')->default(1);

            // Numero di serie
            $table->integer('sets');

            // Numero di ripetizioni 
            $table->integer('reps');

            $table->double('weight_kg')->default(0);

            $table->string('rest_time')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_exercises');
    }
};