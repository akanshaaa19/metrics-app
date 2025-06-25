"use client";

import axios from "axios";
import { useState } from "react";

interface MetricsData {
  success: boolean;
  status: number;
  totalRows: number;
  tagCounts: {
    [key: string]: {
      total: number;
      P0: number;
      P1: number;
      P2: number;
      P3: number;
      P4: number;
    };
  };
  crossTagAnalysis?: {
    [key: string]: {
      [key: string]: number;
      Total: number;
    };
  };
  avgClosureTime: number;
  avgResponseTime: number;
}

const getTagColor = (tag: string) => {
  const colors: { [key: string]: string } = {
    Resources: "bg-purple-100 text-purple-800",
    Resolved: "bg-green-100 text-green-800",
    Bug: "bg-red-100 text-red-800",
    "Knowledge Gap": "bg-blue-100 text-blue-800",
    "In Process": "bg-yellow-100 text-yellow-800",
    "New Feature": "bg-lime-100 text-teal-800",
    "Documentation update": "bg-pink-100 text-pink-800",
  };
  return colors[tag] || "bg-gray-100 text-gray-800";
};

const getPriorityColor = (priority: string) => {
  const colors: { [key: string]: string } = {
    P0: "bg-red-500 text-white",
    P1: "bg-orange-500 text-white",
    P2: "bg-yellow-500 text-white",
    P3: "bg-green-500 text-white",
    P4: "bg-blue-500 text-white",
  };
  return colors[priority] || "bg-gray-500 text-white";
};

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);

  const getMetrics = async () => {
    setLoading(true);
    console.log("Getting metrics for:", { startDate, endDate });
    const getUrl = `https://script.google.com/macros/s/AKfycbzFlIXWABXbcYzfC_b3cqtdbIs5zMSgnrisATH7jy6M5p4ldhrbsS-vLqflvBokqf16/exec?startDate=${startDate}&endDate=${endDate}`;

    await axios.get(getUrl, { maxRedirects: 5 }).then((response) => {
      setLoading(false);
      setMetricsData(response.data);
    });
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setMetricsData(null);
  };

  return (
    <div className="min-h-screen p-8 ">
      <div className=" w-full space-y-6 flex items-center flex-col">
        <h1 className="text-3xl font-bold text-center">Support Metrics</h1>

        <div className="sm:w-1/2 w-full flex space-y-4 flex-col">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-2 text-white"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
                style={{
                  colorScheme: "dark",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-2 text-white"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-white"
                style={{
                  colorScheme: "dark",
                }}
              />
            </div>

            <div className="w-full space-x-4 flex ">
              <button
                onClick={resetForm}
                className="flex-1 border-1 border-gray-300 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium w-1/2"
                disabled={loading}
              >
                Reset
              </button>
              <button
                onClick={getMetrics}
                className="w-1/2 bg-indigo-400 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                disabled={loading}
              >
                {loading ? "Loading..." : "Get Metrics"}
              </button>
            </div>
          </div>

          {metricsData && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Total Tickets
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {metricsData.totalRows}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Avg Closure Time
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {metricsData.avgClosureTime.toFixed(2)} hours
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Avg Response Time
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {metricsData.avgResponseTime.toFixed(2)} hours
                  </p>
                </div>
              </div>

              {/* Tag Counts Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ticket Status by Priority
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tag
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P0
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P1
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P2
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P3
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            P4
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 text-xs sm:text-sm">
                        {Object.entries(metricsData.tagCounts).map(
                          ([tag, counts]) => (
                            <tr key={tag} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTagColor(
                                    tag
                                  )}`}
                                >
                                  {tag}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                {counts.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                    "P0"
                                  )}`}
                                >
                                  {counts.P0}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                    "P1"
                                  )}`}
                                >
                                  {counts.P1}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                    "P2"
                                  )}`}
                                >
                                  {counts.P2}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                    "P3"
                                  )}`}
                                >
                                  {counts.P3}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${getPriorityColor(
                                    "P4"
                                  )}`}
                                >
                                  {counts.P4}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Cross Tag Analysis Table */}
              {metricsData.crossTagAnalysis && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ticket Status by Category
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="max-h-80 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Primary Tag
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              In Process
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Resolved
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Pending From Org
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-xs sm:text-sm">
                          {Object.entries(metricsData.crossTagAnalysis).map(
                            ([tag, analysis]) => (
                              <tr key={tag} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTagColor(
                                      tag
                                    )}`}
                                  >
                                    {tag}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {analysis["In Process"] || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {analysis["Resolved"] || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {analysis["Pending from Org"] || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                  {analysis["Total"] || 0}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
