import { describe, expect, it } from 'vitest';
import https from 'node:https';
import type { IncomingMessage } from 'node:http';

interface HttpResponse {
	statusCode: number | undefined;
	headers: IncomingMessage['headers'];
	body: string;
}

describe('node:https', () => {
	it('should be able to fetch google.com via HTTPS', async () => {
		const response = await new Promise<HttpResponse>((resolve, reject) => {
			const req = https.request('https://www.google.com', { method: 'GET' }, (res) => {
				let data = '';
				
				res.on('data', (chunk) => {
					data += chunk;
				});
				
				res.on('end', () => {
					resolve({
						statusCode: res.statusCode,
						headers: res.headers,
						body: data
					});
				});
			});
			
			req.on('error', (err) => {
				reject(err);
			});
			
			req.end();
		});

		// Verify we got a successful response
		expect(response.statusCode).toBe(200);
		
		// Verify we got some HTML content (Google's homepage)
		expect(response.body).toContain('<html');
		expect(response.body).toContain('Google');
		
		// Verify we got proper headers
		expect(response.headers['content-type']).toBeDefined();
	});
});
