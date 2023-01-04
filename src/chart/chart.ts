import { lightningChart, renderToPNG } from '@arction/lcjs-headless'
import { createProgressiveTraceGenerator } from '@arction/xydata'
import { MapTypes, Themes } from '@arction/lcjs'
import { Request } from 'express'
import * as path from 'path'
import { PNG } from 'pngjs'

// Initialize Lightning Chart
// if a license key should be used, add it to this call
const lc = lightningChart({
    resourcesBaseUrl: `fs:${path.resolve(__dirname, '..', '..', 'node_modules', '@arction', 'lcjs', 'dist', 'resources')}`,
})

/**
 * Data Generator
 */
const generator = createProgressiveTraceGenerator().setNumberOfPoints(100)

/**
 * Storage for latest n charts
 */
const latestCharts: Buffer[] = []
/**
 * Number of stored chart images
 */
const nCharts = 6

/**
 * Add a sharp image to the list of latest generated images
 * @param img Image to store
 */
export const addToLatest = (img: PNG) => {
    if (latestCharts.length < nCharts) {
        latestCharts.unshift(PNG.sync.write(img))
    } else {
        latestCharts.pop()
        latestCharts.unshift(PNG.sync.write(img))
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
    theme: 'darkGold' | 'light'
    /**
     * Chart title
     */
    title: string
}

/**
 * Generate a chart based on the provided options
 * @param options Chart generation options
 */
export const generateChart = async (options: ChartOptions): Promise<PNG> => {
    // generate data
    const data = await generator.generate().toPromise()
    // prepare theme, based on options
    const theme = options.theme === 'light' ? Themes.light : Themes.darkGold
    // initialize the chart
    const chart = lc
        .ChartXY({
            theme,
        })
        // set chart title to the provided title from options
        .setTitle(options.title)
    // create a new series, use horizontalProgressive data pattern for improved performance
    const series = chart.addLineSeries({
        dataPattern: {
            pattern: 'ProgressiveX',
        },
    })
    // add the generated data to the series
    series.add(data)

    // render the chart to a sharp based image using a helper method from @arction/lcjs-headless package
    const img = await renderToPNG(chart, 721, 720)

    // clean up the chart, ensure that all resources used by the chart are released
    series.dispose()
    chart.dispose()

    // return the generated image
    return img
}

/**
 * Generate a chart based on the provided options
 * @param options Chart generation options
 */
export const generateMapChart = async (options: ChartOptions): Promise<PNG> => {
    // prepare theme, based on options
    const theme = options.theme === 'light' ? Themes.light : Themes.darkGold
    // initialize the chart
    const chart = lc
        .Map({
            theme,
            type: MapTypes.Europe,
        })
        // set chart title to the provided title from options
        .setTitle(options.title)
    const p = new Promise((r) => {
        chart.onMapDataReady(r as () => void)
    })
    await p
    // render the chart to a sharp based image using a helper method from @arction/lcjs-headless package
    const img = await renderToPNG(chart, 721, 720)

    // clean up the chart, ensure that all resources used by the chart are released
    chart.dispose()

    // return the generated image
    return img
}

/**
 * Get chart generation options for the latest user
 */
export const getChartOptionsFromSession = (req: Request, type: string): ChartOptions => {
    return {
        title: req.session.chartTitle || type === 'map' ? 'Map' : 'ChartXY',
        theme: req.session.theme || 'darkGold',
    }
}

/**
 * Populate the latest generated charts list
 */
const populateLatest = async () => {
    for (let i = 0; i < nCharts; i += 1) {
        generateChart({
            title: 'ChartXY',
            theme: 'darkGold',
        }).then(addToLatest)
    }
}
// Initially populate the list
populateLatest()
