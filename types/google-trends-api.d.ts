declare module 'google-trends-api' {
    interface TrendsOptions {
      keyword: string | string[]
      startTime?: Date
      endTime?: Date
      geo?: string
      category?: number
      timezone?: number
      hl?: string
    }
  
    export function interestOverTime(options: TrendsOptions): Promise<string>
    export function relatedQueries(options: TrendsOptions): Promise<string>
    export function relatedTopics(options: TrendsOptions): Promise<string>
    export function dailyTrends(options: TrendsOptions): Promise<string>
    export function realTimeTrends(options: TrendsOptions): Promise<string>
  
    const trends: {
      interestOverTime: typeof interestOverTime
      relatedQueries: typeof relatedQueries
      relatedTopics: typeof relatedTopics
      dailyTrends: typeof dailyTrends
      realTimeTrends: typeof realTimeTrends
    }
  
    export default trends
  }
  