import { lightningChart, renderToSharp } from '@arction/lcjs-headless'
import { createProgressiveTraceGenerator } from '@arction/xydata'
import { Themes, DataPatterns } from '@arction/lcjs'
import sharp from 'sharp'
import { Request } from 'express'

// Initialize Lightning Chart
// if a license key should be used, add it to this call
const lc = lightningChart()

/**
 * Data Generator
 */
const generator = createProgressiveTraceGenerator().setNumberOfPoints(100)

/**
 * Storage for latest n charts
 */
const latestCharts: sharp.Sharp[] = []
/**
 * Number of stored chart images
 */
const nCharts = 6

/**
 * Add a sharp image to the list of latest generated images
 * @param img Image to store
 */
export const addToLatest = (img: sharp.Sharp) => {
    if (latestCharts.length < nCharts) {
        latestCharts.unshift(img.clone())
    } else {
        latestCharts.pop()
        latestCharts.unshift(img.clone())
    }
}

/**
 * Get chart from the latest charts list
 * @param id Index of chart to retrieve
 */
export const getChartImage = (id: number) => {
    return latestCharts[id]
}

/**
 * Chart generation options
 */
export interface ChartOptions {
    /**
     * Chart theme
     */
    theme: 'dark' | 'light'
    /**
     * Chart title
     */
    title: string
}

/**
 * Generate a chart based on the provided options
 * @param options Chart generation options
 */
export const generateChart = async (options: ChartOptions): Promise<sharp.Sharp> => {
    // generate data
    const data = await generator.generate().toPromise()
    // prepare theme, based on options
    const theme = options.theme === 'light' ? Themes.light : Themes.dark
    // initialize the chart
    const chart = lc
        .ChartXY({
            theme,
        })
        // set chart title to the provided title from options
        .setTitle(options.title)
    // create a new series, use horizontalProgressive data pattern for improved performance
    const series = chart.addLineSeries({
        dataPattern: DataPatterns.horizontalProgressive,
    })
    // add the generated data to the series
    series.add(data)

    // render the chart to a sharp based image using a helper method from @arction/lcjs-headless package
    const img = await renderToSharp(chart, 721, 720)

    // clean up the chart, ensure that all resources used by the chart are released
    series.dispose()
    chart.dispose()

    // return the generated image
    return img
}

/**
 * Get chart generation options for the latest user
 */
export const getChartOptionsFromSession = (req: Request): ChartOptions => {
    return {
        title: req.session.chartTitle || 'ChartXY',
        theme: req.session.theme || 'dark',
    }
}

/**
 * Populate the latest generated charts list
 */
const populateLatest = async () => {
    for (let i = 0; i < nCharts; i += 1) {
        generateChart({
            title: 'ChartXY',
            theme: 'dark',
        }).then(addToLatest)
    }
}
// Initially populate the list
populateLatest()
