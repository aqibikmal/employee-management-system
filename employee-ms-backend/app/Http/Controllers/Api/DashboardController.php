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
     * inject the DashboardService automatically
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
        // call the service to get stats
        $stats = $this->dashboardService->getDashboardStats();

        // return the stats as JSON
        return response()->json($stats);
    }
}
