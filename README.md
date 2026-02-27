## Glitch Market - Ürün Yönetim Paneli
Bu uygulama, bir e-ticaret sistemindeki tutarsız ("glitch") verileri tespit etmek, bu verileri normalize ederek kullanıcıya sunmak ve verilerin güvenli bir şekilde güncellenmesini sağlamak amacıyla geliştirilmiş bir yönetim arayüzüdür.

## Kurulum ve Çalıştırma
Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

## Uygulamayı geliştirme modunda başlatın
npm run dev -
npm install

## Kısa Mimari Açıklama
Klasör Yapısı (Folder Structure)
Uygulama, kodun okunabilirliğini ve bakımını kolaylaştırmak için şu yapıda kurgulanmıştır:

src/api: API isteklerinin (CRUD işlemleri) toplandığı katman (products.ts).

src/components: Sayfa bazlı ana bileşenler (ProductDetailPage.tsx, EditProductPage.tsx) ve tekrar kullanılabilir UI parçaları (ProductTable.tsx, ProductRow.tsx).

src/utils: Normalizasyon mantığının ve hata analizlerinin yapıldığı merkezi nokta (normalize.ts).

src/types: TypeScript arayüz tanımlamaları ile veri güvenliğinin sağlandığı klasör.

src/data: Mock veri setinin bulunduğu alan (products.json).

## Veri Akışı 
Veri yönetimi için modern TanStack Query (React Query) mimarisi kullanılmıştır:

Server State: Veriler API katmanından çekilir ve useQuery ile önbelleğe alınır.

Normalization: Ham veri (raw data) henüz bileşenlere ulaşmadan utils/normalize.ts üzerinden süzgeçten geçirilir.

UI Rendering: Temizlenmiş veri arayüzde gösterilirken, eş zamanlı olarak "Glitch Raporu" ile ham verideki hatalar kullanıcıya sunulur.

Cache Sync: Güncelleme (mutation) sonrası invalidateQueries tetiklenerek uygulamanın tüm sayfalarında güncel verinin gösterilmesi sağlanır.

## Normalize Yaklaşımı & Glitch Handling
Uygulamanın temel amacı, bozuk veriyi düzeltip sisteme geri kazandırmaktır.

## Hangi Verileri Nasıl Normalize Ettim?
Normalizasyon sürecinde src/utils/normalize.ts dosyası ana kontrol merkezi olarak çalışır:

Ürün İsmi: Başındaki ve sonundaki görünmeyen boşluklar trim() ile temizlenir.

Fiyat: String veya tanımsız (undefined) gelen fiyat verileri sayısal formata çevrilir. Geçersiz durumlarda 0 atanarak sistemin çökmesi engellenir.

Stok: Negatif değerler iş mantığı gereği 0 olarak normalize edilir.

## Glitch Handling Stratejisi
Karşılaştırmalı Analiz: Ham veri ile normalize edilmiş veri arasındaki farklar anlık olarak analiz edilir.

Şeffaf Raporlama: Eğer bir veride düzeltme yapıldıysa (örneğin fiyat "tanımsız"dan 0'a çekildiyse), bu durum "Glitch Analiz Raporu" panelinde kullanıcıya gerekçesiyle gösterilir.

Form Koruması: Düzenleme sayfasında kullanıcıya her zaman normalize edilmiş temiz veri sunulur; böylece hatalı verinin veritabanına tekrar yazılmasının önüne geçilir.

## Edge-Case Yaklaşımı
Race Condition: Veri güncellendikten hemen sonra sayfa geçişlerinde eski verinin görünmemesi için asenkron cache temizleme stratejisi uygulanmıştır.

Erişim Kontrolü: Geçersiz bir ürün ID'si ile sayfaya girilmeye çalışıldığında kullanıcıyı ana sayfaya yönlendiren veya hata mesajı gösteren kontroller eklenmiştir.
