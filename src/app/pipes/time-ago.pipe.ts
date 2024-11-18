import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeAgo'
  })
  export class TimeAgoPipe implements PipeTransform {
    transform(value: Date | string): string {
      const now = new Date();
      const past = new Date(value);
      const diffMs = now.getTime() - past.getTime();
      const diffSec = Math.round(diffMs / 1000);
      const diffMin = Math.round(diffSec / 60);
      const diffHour = Math.round(diffMin / 60);
      const diffDays = Math.round(diffHour / 24);
  
      if (diffSec < 60) return `${diffSec} sec ago`;
      if (diffMin < 60) return `${diffMin} min ago`;
      if (diffHour < 24) return `${diffHour} hr ago`;
      return `${diffDays} days ago`;
    }
  }
  