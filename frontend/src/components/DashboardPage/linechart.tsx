import { Area, AreaChart, CartesianGrid, Label, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { cx } from "@/utils/cx";

export interface LineChartDataItem {
    date: Date | string;
    A: number;
    B: number;
    C: number;
}

const defaultLineData: LineChartDataItem[] = [
    { date: new Date(2026, 0, 1), A: 12, B: 4, C: 1 },
    { date: new Date(2026, 1, 1), A: 15, B: 5, C: 2 },
    { date: new Date(2026, 2, 1), A: 18, B: 3, C: 0 },
    { date: new Date(2026, 3, 1), A: 22, B: 6, C: 1 },
    { date: new Date(2026, 4, 1), A: 25, B: 4, C: 2 },
    { date: new Date(2026, 5, 1), A: 30, B: 5, C: 1 },
];

interface LineChart01Props {
    data?: LineChartDataItem[];
}

export const LineChart01 = ({ data = defaultLineData }: LineChart01Props) => {
    const isDesktop = useBreakpoint("lg");

    const colors: Record<string, string> = {
        A: "text-primary", // Theme Primary - Verified
        B: "text-[#3b82f6]", // Blue - Pending
        C: "text-[#f59e0b]", // Amber - Revoked
    };

    return (
        <div className="flex h-60 flex-col gap-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    className="text-slate-500 [&_.recharts-text]:text-xs"
                    margin={{
                        top: isDesktop ? 12 : 6,
                        bottom: isDesktop ? 16 : 0,
                        right: 10,
                        left: -15,
                    }}
                >
                    <defs>
                        <linearGradient id="gradient-emerald" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />

                    <Legend
                        align="right"
                        verticalAlign="top"
                        layout={isDesktop ? "vertical" : "horizontal"}
                        content={<ChartLegendContent className="-translate-y-2" />}
                    />

                    <XAxis
                        stroke="#94a3b8"
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        dataKey="date"
                        tickFormatter={(value) => {
                            const d = value instanceof Date ? value : new Date(value);
                            return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined, { month: "short" });
                        }}
                        padding={{ left: 10, right: 10 }}
                    >
                        {isDesktop && (
                            <Label fill="#64748b" className="text-xs font-medium max-lg:hidden" position="bottom" offset={0}>
                                Month
                            </Label>
                        )}
                    </XAxis>

                    <YAxis
                        stroke="#94a3b8"
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                        tickFormatter={(value) => Number(value).toLocaleString()}
                    >
                        <Label
                            value="Certificates"
                            fill="#64748b"
                            className="text-xs font-medium"
                            style={{ textAnchor: "middle" }}
                            angle={-90}
                            position="insideLeft"
                            offset={-5}
                        />
                    </YAxis>

                    <Tooltip
                        content={<ChartTooltipContent />}
                        formatter={(value) => Number(value).toLocaleString()}
                        labelFormatter={(value) => {
                            if (!value) return "";
                            const d = value instanceof Date ? value : new Date(String(value));
                            return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
                        }}
                        cursor={{
                            stroke: "var(--primary)",
                            strokeWidth: 1.5,
                            strokeDasharray: "4 4",
                        }}
                    />

                    <Area
                        isAnimationActive={true}
                        className={cx(colors["A"], "[&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]")}
                        dataKey="A"
                        name="Verified"
                        type="monotone"
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="url(#gradient-emerald)"
                        activeDot={{
                            r: 5,
                            className: "fill-white stroke-primary stroke-2",
                        }}
                    />

                    <Area
                        isAnimationActive={true}
                        className={cx(colors["B"], "[&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]")}
                        dataKey="B"
                        name="Pending"
                        type="monotone"
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                        activeDot={{
                            r: 5,
                            className: "fill-white stroke-[#3b82f6] stroke-2",
                        }}
                    />

                    <Area
                        isAnimationActive={true}
                        className={cx(colors["C"], "[&_.recharts-area-area]:translate-y-1.5 [&_.recharts-area-area]:[clip-path:inset(0_0_6px_0)]")}
                        dataKey="C"
                        name="Revoked"
                        type="monotone"
                        stroke="currentColor"
                        strokeWidth={2}
                        fill="none"
                        activeDot={{
                            r: 5,
                            className: "fill-white stroke-[#f59e0b] stroke-2",
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
