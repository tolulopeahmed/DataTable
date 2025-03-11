import { Component, OnInit } from '@angular/core';
import { DataTableService } from '../../services/data-table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Post {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class DataTableComponent implements OnInit {
  data: Post[] = [];
  sortedData: Post[] = [];
  paginatedData: Post[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm: string = '';
  selectedFilter: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 1;

  constructor(private dataTableService: DataTableService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.dataTableService.getData().subscribe({
      next: (response: Post[]) => {
        this.data = response;
        this.sortedData = [...this.data];
        this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
        this.updatePagination();
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = error.message || 'Failed to load data';
        this.isLoading = false;
      },
    });
  }

  filterData() {
    this.sortedData = this.data.filter((post) => {
      const searchLower = this.searchTerm.toLowerCase();
      if (!this.selectedFilter || this.selectedFilter === '') {
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.body.toLowerCase().includes(searchLower) ||
          post.id.toString().includes(searchLower)
        );
      } else {
        return post[this.selectedFilter as keyof Post]
          .toString()
          .toLowerCase()
          .includes(searchLower);
      }
    });
    this.currentPage = 1; // Reset to first page after filtering
    this.totalPages = Math.ceil(this.sortedData.length / this.itemsPerPage);
    this.updatePagination();
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedData.sort((a, b) => {
      const valueA = a[column as keyof Post];
      const valueB = b[column as keyof Post];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0;
    });

    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.sortedData.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
