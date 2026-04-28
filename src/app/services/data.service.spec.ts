import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data from downloadFromOneDrive', (done) => {
    service.downloadFromOneDrive().subscribe(data => {
      expect(data).toBeTruthy();
      expect(data.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should have correct data structure', (done) => {
    service.downloadFromOneDrive().subscribe(data => {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('nombre');
      expect(data[0]).toHaveProperty('email');
      done();
    });
  });
});
