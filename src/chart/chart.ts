import { lightningChart, renderToSharp } from 'lcjs-headless'
import { createProgressiveTraceGenerator } from '@arction/xydata'
import { DataPatterns, Themes } from 'lcjs'
import sharp from 'sharp'

const lc = lightningChart()

const generator = createProgressiveTraceGenerator().setNumberOfPoints(100)

const latestCharts: sharp.Sharp[] = []

export const addToLatest = (img: sharp.Sharp) => {
    if (latestCharts.length < 5) {
        latestCharts.push(img.clone())
    } else {
        latestCharts.shift()
        latestCharts.push(img.clone())
    }
}

export const getChartImage = (id: number) => {
    return latestCharts[id]
}

export interface ChartOptions {
    theme?: 'dark' | 'light'
    title: string
}

export const generateChart = async (options: ChartOptions): Promise<sharp.Sharp> => {
    const data = await generator.generate().toPromise()
    console.log(options)
    const theme = options.theme === 'light' ? Themes.light : Themes.dark
    const chart = lc
        .ChartXY({
            theme,
        })
        .setTitle(options.title)
    const series = chart.addLineSeries({
        dataPattern: DataPatterns.horizontalProgressive,
    })
    series.add(data)

    const img = await renderToSharp(chart, 720, 720)
    series.dispose()
    chart.dispose()
    return img
}
