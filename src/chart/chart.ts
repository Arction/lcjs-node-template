import { lightningChart, renderToSharp } from 'lcjs-headless'
import { createProgressiveTraceGenerator } from '@arction/xydata'
import { DataPatterns, Themes } from 'lcjs'
import sharp from 'sharp'
import { Request } from 'express'

const lc = lightningChart()

const generator = createProgressiveTraceGenerator().setNumberOfPoints(100)

const latestCharts: sharp.Sharp[] = []
const nCharts = 6

export const addToLatest = (img: sharp.Sharp) => {
    if (latestCharts.length < nCharts) {
        latestCharts.unshift(img.clone())
    } else {
        latestCharts.pop()
        latestCharts.unshift(img.clone())
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

export const getChartOptionsFromSession = (req: Request): ChartOptions => {
    return {
        title: req.session.chartTitle || 'ChartXY',
        theme: req.session.theme || 'dark',
    }
}

const populateLatest = async () => {
    for (let i = 0; i < nCharts; i += 1) {
        generateChart({
            title: 'ChartXY',
            theme: 'dark',
        }).then(addToLatest)
    }
}

populateLatest()
