const fs = require('fs');

const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzc4MTQ5MzE4LCJleHAiOjE3NzgyMzU3MTh9.y1ZSyYNhidw9fsV0FvPdaevie8UmH9uO95FG71rIoaE';
const staffToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IlN0YWZmIiwiaWF0IjoxNzc4MTQ5MzMwLCJleHAiOjE3NzgyMzU3MzB9.yEk-94TXW8CHRaf3mc9UtvkLmHUMupAS7n2DAm0VVAs';

const collection = {
  info: {
    name: 'Travel Agency API - Full Test Suite',
    description: 'Comprehensive API tests including courier filters and status transitions.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [
    {
      name: 'Health',
      item: [
        {
          name: 'Check Health',
          request: {
            method: 'GET',
            url: '{{baseUrl}}/health',
          },
          response: [
            {
              name: 'Success',
              status: 'OK',
              code: 200,
              body: JSON.stringify({"status":"success","message":"Travel Agency API is running smoothly.","timestamp":"May 7, 2026"}, null, 2),
            },
          ],
        },
      ],
    },
    {
      name: 'Admin Auth',
      item: [
        {
          name: 'Login',
          request: {
            method: 'POST',
            url: '{{baseUrl}}/admin/auth/login',
            body: {
              mode: 'raw',
              raw: JSON.stringify({ email: 'admin@travel.com', password: 'travel@pass' }, null, 2),
              options: { raw: { language: 'json' } },
            },
          },
          response: [
            {
              name: 'Success',
              status: 'OK',
              code: 200,
              body: JSON.stringify({
                success: true,
                data: {
                  accessToken: adminToken,
                  refreshToken: '...',
                  user: { id: 1, email: 'admin@travel.com', role: 'Admin' },
                },
              }, null, 2),
            },
          ],
        },
      ],
    },
    {
      name: 'Admin Staff',
      item: [
        {
          name: 'Get All Staff',
          request: {
            method: 'GET',
            url: '{{baseUrl}}/admin/staff',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
          },
          response: [
            {
              name: 'Success',
              status: 'OK',
              code: 200,
              body: JSON.stringify({
                success: true,
                count: 1,
                data: [
                  {
                    id: 1,
                    staffId: 'STAFF001',
                    name: 'Default Staff',
                    email: null,
                    assignedLocationId: 1,
                    status: 'ACTIVE',
                    createdAt: 'May 7, 2026',
                    updatedAt: 'May 7, 2026',
                    assignedLocation: { id: 1, location: 'Main Branch' },
                  },
                ],
              }, null, 2),
            },
          ],
        },
      ],
    },
    {
      name: 'Staff Auth',
      item: [
        {
          name: 'Login',
          request: {
            method: 'POST',
            url: '{{baseUrl}}/staff/auth/login',
            body: {
              mode: 'raw',
              raw: JSON.stringify({ staffId: 'STAFF001', password: 'travel@pass' }, null, 2),
              options: { raw: { language: 'json' } },
            },
          },
          response: [
            {
              name: 'Success',
              status: 'OK',
              code: 200,
              body: JSON.stringify({
                success: true,
                data: {
                  accessToken: staffToken,
                  refreshToken: '...',
                  user: { id: 1, staffId: 'STAFF001', role: 'Staff' },
                },
              }, null, 2),
            },
          ],
        },
      ],
    },
    {
      name: 'Couriers',
      item: [
        {
          name: 'Create Courier',
          request: {
            method: 'POST',
            url: '{{baseUrl}}/staff/couriers',
            header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({
                destination: 'Branch B',
                customerName: 'John Doe',
                phoneNumber: '1234567890',
                productDescription: 'Laptop',
                weight: 2.5,
                paymentMethod: 'PRE_PAYMENT',
                deadlineDate: '2026-06-01',
                cashMethod: 'CASH',
                totalAmount: 500,
              }, null, 2),
              options: { raw: { language: 'json' } },
            },
          },
          response: [
            {
              name: 'Success',
              status: 'Created',
              code: 201,
              body: JSON.stringify({
                success: true,
                data: {
                  id: 1,
                  staffId: 1,
                  origin: 'Main Branch',
                  destination: 'Branch B',
                  customerName: 'John Doe',
                  phoneNumber: '1234567890',
                  productDescription: 'Laptop',
                  isFragile: false,
                  weight: 2.5,
                  status: 'INPLACE',
                  paymentMethod: 'PRE_PAYMENT',
                  deadlineDate: 'June 1, 2026',
                  cashMethod: 'CASH',
                  totalAmount: 500,
                  createdAt: 'May 7, 2026',
                  updatedAt: 'May 7, 2026',
                },
              }, null, 2),
            },
          ],
        },
        {
          name: 'Filters',
          item: [
            {
              name: 'Filter: ALL',
              request: {
                method: 'GET',
                url: '{{baseUrl}}/staff/couriers?status=ALL',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: fs.readFileSync('scratch/filter_all.json', 'utf8') || '{}',
                },
              ],
            },
            {
              name: 'Filter: INPLACE',
              request: {
                method: 'GET',
                url: '{{baseUrl}}/staff/couriers?status=INPLACE',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: fs.readFileSync('scratch/filter_inplace.json', 'utf8') || '{}',
                },
              ],
            },
            {
              name: 'Filter: SHIPPING',
              request: {
                method: 'GET',
                url: '{{baseUrl}}/staff/couriers?status=SHIPPING',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: fs.readFileSync('scratch/filter_shipping.json', 'utf8') || '{}',
                },
              ],
            },
            {
              name: 'Filter: INCOMING',
              request: {
                method: 'GET',
                url: '{{baseUrl}}/staff/couriers?status=INCOMING',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: fs.readFileSync('scratch/filter_incoming.json', 'utf8') || '{}',
                },
              ],
            },
            {
              name: 'Filter: RECEIVED',
              request: {
                method: 'GET',
                url: '{{baseUrl}}/staff/couriers?status=RECEIVED',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: fs.readFileSync('scratch/filter_received.json', 'utf8') || '{}',
                },
              ],
            },
            {
              name: 'Filter: SENT',
              request: {
                method: 'GET',
                url: '{{baseUrl}}/staff/couriers?status=SENT',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: fs.readFileSync('scratch/filter_sent.json', 'utf8') || '{}',
                },
              ],
            },
          ],
        },
        {
          name: 'Actions',
          item: [
            {
              name: 'Ship Courier (Pending -> Shipping)',
              request: {
                method: 'PATCH',
                url: '{{baseUrl}}/staff/couriers/7/ship',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: JSON.stringify({
                    success: true,
                    message: 'Courier is now in shipping',
                    data: { id: 7, status: 'SHIPPING' },
                  }, null, 2),
                },
              ],
            },
            {
              name: 'Receive Courier (Shipping -> Delivered)',
              request: {
                method: 'PATCH',
                url: '{{baseUrl}}/staff/couriers/4/receive',
                header: [{ key: 'Authorization', value: 'Bearer {{staffToken}}' }],
              },
              response: [
                {
                  name: 'Success',
                  status: 'OK',
                  code: 200,
                  body: JSON.stringify({
                    success: true,
                    message: 'Courier has been delivered successfully',
                    data: { id: 4, status: 'DELIVERED' },
                  }, null, 2),
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000/api/v1', type: 'string' },
    { key: 'adminToken', value: adminToken, type: 'string' },
    { key: 'staffToken', value: staffToken, type: 'string' },
  ],
};

fs.writeFileSync('Travel-Agency.postman_collection.json', JSON.stringify(collection, null, 2));
console.log('Postman collection generated successfully!');
