import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ImpactMetric {
    id: number;
    label: string;
    value: number;
    unit?: string;
    icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ImpactService {
    private apiUrl = `${environment.apiUrl}/impact-metrics/`;

    constructor(private http: HttpClient) {}

    getMetrics(): Observable<ImpactMetric[]> {
        return this.http.get<ImpactMetric[]>(this.apiUrl);
    }
}