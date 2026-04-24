import { Pagination } from 'antd';
import { router } from '@inertiajs/react';

interface Props {
    meta: {
        current_page: number;
        total: number;
        per_page: number;
    };
    // Opzionale: per passare filtri o altri parametri nell'URL
    queryParams?: object; 
}

export default function AntdPagination({ meta, queryParams = {} }: Props) {
    const handlePageChange = (page: number) => {
        router.get(
            window.location.pathname, 
            { ...queryParams, page: page }, 
            { preserveScroll: true, preserveState: true }
        );
    };

    return (
        <div className="flex justify-center py-6">
            <Pagination
                current={meta.current_page}
                total={meta.total}
                pageSize={meta.per_page}
                onChange={handlePageChange}
                showSizeChanger={false} // Per bloccare a 10 per pagina
            />
        </div>
    );
}