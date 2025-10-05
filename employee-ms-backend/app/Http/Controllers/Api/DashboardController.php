<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;

class DashboardController extends Controller
{
    /**
     * @var DashboardService
     */
    protected $dashboardService;

    /**
     * Suntik (inject) DashboardService secara automatik.
     */
    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Get statistics for the dashboard.
     */
    public function stats()
    {
        // Panggil service untuk dapatkan semua statistik
        $stats = $this->dashboardService->getDashboardStats();

        // Pulangkan response. Sangat bersih!
        return response()->json($stats);
    }
}
