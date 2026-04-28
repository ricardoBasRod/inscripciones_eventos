import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dataService: DataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [DataService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title', () => {
    expect(component.title).toBe('Gestión de Eventos - Inscripciones');
  });

  it('should call downloadData', () => {
    spyOn(dataService, 'downloadFromOneDrive').and.returnValue(of([]));
    component.downloadData();
    expect(dataService.downloadFromOneDrive).toHaveBeenCalled();
  });

  it('should update tableData after download', (done) => {
    const mockData = [
      {
        id: 1,
        nombre: 'Test User',
        email: 'test@example.com'
      }
    ];

    spyOn(dataService, 'downloadFromOneDrive').and.returnValue(of(mockData));
    component.downloadData();

    setTimeout(() => {
      expect(component.tableData).toEqual(mockData);
      expect(component.isLoading).toBeFalse();
      done();
    }, 100);
  });
});
