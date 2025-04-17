import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useRouter } from 'next/router';

export default function TestDbAccess() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    async function runTests() {
      setLoading(true);
      setError(null);
      const testResults: any = {};

      try {
        // 1. Test connection and user
        const { data: { user } } = await supabase.auth.getUser();
        testResults.user = user;

        // 2. Test access to folhas_obras
        const { data: folhasObras, error: folhasObrasError } = await supabase
          .from('folhas_obras')
          .select('*')
          .limit(5);
        
        testResults.folhasObras = {
          success: !folhasObrasError,
          count: folhasObras?.length || 0,
          error: folhasObrasError ? folhasObrasError.message : null,
          data: folhasObras ? folhasObras.slice(0, 1) : null  // Just show the first record
        };

        // 3. Test access to items
        const { data: items, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .limit(5);
        
        testResults.items = {
          success: !itemsError,
          count: items?.length || 0,
          error: itemsError ? itemsError.message : null,
          data: items ? items.slice(0, 1) : null  // Just show the first record
        };

        // 4. Try inserting into folhas_obras
        const testWorkOrder = {
          numero_fo: Math.floor(Math.random() * 9000) + 1000,
          nome_campanha: 'Test Campaign ' + Date.now(),
          notas: 'Testing authenticated access',
          prioridade: false
        };
        
        const { data: insertedFO, error: insertFOError } = await supabase
          .from('folhas_obras')
          .insert(testWorkOrder)
          .select()
          .single();
        
        testResults.insert = {
          success: !insertFOError,
          error: insertFOError ? insertFOError.message : null,
          data: insertedFO || null
        };

        // 5. If insert successful, test item creation
        if (insertedFO) {
          const testItem = {
            folha_obra_id: insertedFO.id,
            descricao: 'Test Item ' + Date.now(),
            codigo: 'TST-' + Date.now(),
            em_curso: true
          };
          
          const { data: insertedItem, error: insertItemError } = await supabase
            .from('items')
            .insert(testItem)
            .select()
            .single();
          
          testResults.insertItem = {
            success: !insertItemError,
            error: insertItemError ? insertItemError.message : null,
            data: insertedItem || null
          };

          // 6. Cleanup - delete the test records
          if (insertedItem) {
            const { error: deleteItemError } = await supabase
              .from('items')
              .delete()
              .eq('id', insertedItem.id);
            
            testResults.deleteItem = {
              success: !deleteItemError,
              error: deleteItemError ? deleteItemError.message : null
            };
          }

          const { error: deleteFOError } = await supabase
            .from('folhas_obras')
            .delete()
            .eq('id', insertedFO.id);
          
          testResults.deleteFO = {
            success: !deleteFOError,
            error: deleteFOError ? deleteFOError.message : null
          };
        }

        setResults(testResults);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    runTests();
  }, [supabase]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Database Access Test</h1>
      
      {loading && <div className="text-blue-500 mb-4">Running tests...</div>}
      {error && <div className="bg-red-100 p-4 mb-4 rounded">Error: {error}</div>}
      
      {!loading && !error && (
        <div className="space-y-8">
          <div className="bg-green-50 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <pre className="bg-white p-4 rounded overflow-auto">
              {JSON.stringify(results.user, null, 2)}
            </pre>
          </div>

          <div className={`p-4 rounded ${results.folhasObras?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-2">folhas_obras Table Access</h2>
            <div className="mb-2">
              <span className="font-medium">Result:</span> 
              {results.folhasObras?.success ? (
                <span className="text-green-600 ml-2">✅ Success - Found {results.folhasObras.count} records</span>
              ) : (
                <span className="text-red-600 ml-2">❌ Failed - {results.folhasObras?.error}</span>
              )}
            </div>
            {results.folhasObras?.data && (
              <div>
                <div className="font-medium mb-1">Sample Record:</div>
                <pre className="bg-white p-4 rounded overflow-auto">
                  {JSON.stringify(results.folhasObras.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className={`p-4 rounded ${results.items?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-2">items Table Access</h2>
            <div className="mb-2">
              <span className="font-medium">Result:</span> 
              {results.items?.success ? (
                <span className="text-green-600 ml-2">✅ Success - Found {results.items.count} records</span>
              ) : (
                <span className="text-red-600 ml-2">❌ Failed - {results.items?.error}</span>
              )}
            </div>
            {results.items?.data && (
              <div>
                <div className="font-medium mb-1">Sample Record:</div>
                <pre className="bg-white p-4 rounded overflow-auto">
                  {JSON.stringify(results.items.data, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className={`p-4 rounded ${results.insert?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-2">Insert Test</h2>
            <div className="mb-2">
              <span className="font-medium">Result:</span> 
              {results.insert?.success ? (
                <span className="text-green-600 ml-2">✅ Successfully inserted record</span>
              ) : (
                <span className="text-red-600 ml-2">❌ Failed - {results.insert?.error}</span>
              )}
            </div>
          </div>

          {results.insertItem && (
            <div className={`p-4 rounded ${results.insertItem?.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h2 className="text-xl font-semibold mb-2">Insert Item Test</h2>
              <div className="mb-2">
                <span className="font-medium">Result:</span> 
                {results.insertItem?.success ? (
                  <span className="text-green-600 ml-2">✅ Successfully inserted item</span>
                ) : (
                  <span className="text-red-600 ml-2">❌ Failed - {results.insertItem?.error}</span>
                )}
              </div>
            </div>
          )}

          {results.deleteItem && (
            <div className={`p-4 rounded ${results.deleteItem?.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h2 className="text-xl font-semibold mb-2">Delete Item Test</h2>
              <div>
                <span className="font-medium">Result:</span> 
                {results.deleteItem?.success ? (
                  <span className="text-green-600 ml-2">✅ Successfully deleted item</span>
                ) : (
                  <span className="text-red-600 ml-2">❌ Failed - {results.deleteItem?.error}</span>
                )}
              </div>
            </div>
          )}

          {results.deleteFO && (
            <div className={`p-4 rounded ${results.deleteFO?.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h2 className="text-xl font-semibold mb-2">Delete Work Order Test</h2>
              <div>
                <span className="font-medium">Result:</span> 
                {results.deleteFO?.success ? (
                  <span className="text-green-600 ml-2">✅ Successfully deleted work order</span>
                ) : (
                  <span className="text-red-600 ml-2">❌ Failed - {results.deleteFO?.error}</span>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => router.push('/designer-flow')}
            >
              Go Back to Designer Flow
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 