import { Injectable } from "@angular/core";
import { HttpClient} from "@angular/common/http"
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

export interface Login {
    id: number
    title: string
    completed: boolean
    date?: any
}

@Injectable({providedIn: 'root'})

export class LoginService {
    public login: Login[] = [];

    constructor(private http: HttpClient) {}

    fetchLogs(): Observable<Login []>{
        return this.http.get<Login []>('https://jsonplaceholder.typicode.com/todos?_limit=3')
        .pipe(tap(logs => this.login = logs))
    }

    onToggle(id: number) {
        console.log(id);
        const idx = this.login.findIndex(t => t.id === id);
        this.login[idx].completed = !this.login[idx].completed;
    }

    removeLog(id: number) {
        this.login = this.login.filter(t => t.id !== id)
    }
}
