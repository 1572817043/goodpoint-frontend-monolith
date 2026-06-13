#!/bin/bash

TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTc4MTQ0MDczNH0.viQ220wn2JamuCzZQBCy_h_k-dEEvTQUbilp982ASF8"
BASE_DIR="/Users/a0000/商品数据"
UPLOAD_URL="http://localhost:8080/api/upload/image"

# 删除之前的官方商品
mysql -u root -p123456 goodpoint -e "DELETE FROM goods WHERE id >= 6;" 2>/dev/null

# 遍历所有商品文件夹
for dir in "$BASE_DIR"/*/; do
  if [ -f "$dir/商品信息.txt" ]; then
    folder_name=$(basename "$dir")
    echo "处理: $folder_name"

    # 读取商品信息
    name=$(grep "商品名称" "$dir/商品信息.txt" | cut -d'：' -f2 | sed 's/^ *//')
    price=$(grep "优惠后价格" "$dir/商品信息.txt" | cut -d'：' -f2 | sed 's/¥//g' | sed 's/^ *//')
    original_price=$(grep "原价" "$dir/商品信息.txt" | cut -d'：' -f2 | sed 's/¥//g' | sed 's/^ *//')

    # 如果没有优惠后价格，使用原价
    if [ -z "$price" ]; then
      price="$original_price"
    fi

    # 如果没有原价，使用优惠后价格
    if [ -z "$original_price" ]; then
      original_price="$price"
    fi

    # 如果都没有价格，设置默认价格
    if [ -z "$price" ]; then
      price="199"
      original_price="199"
    fi

    # 简化名称（去掉前缀）
    short_name=$(echo "$name" | sed 's/【[^】]*】//g' | sed 's/^ *//')
    if [ -z "$short_name" ]; then
      short_name="$name"
    fi

    echo "  名称: $short_name"
    echo "  价格: $price"
    echo "  原价: $original_price"

    # 找到封面图（主图.jpg 或第一张图片）
    cover_file=""
    if [ -f "$dir/主图.jpg" ]; then
      cover_file="$dir/主图.jpg"
    else
      # 找第一张图片
      for img in "$dir"/图片*.jpg; do
        if [ -f "$img" ]; then
          cover_file="$img"
          break
        fi
      done
    fi

    if [ -z "$cover_file" ]; then
      echo "  没有图片，跳过"
      continue
    fi

    # 上传封面图
    echo "  上传封面: $(basename "$cover_file")"
    cover_url=$(curl -s -X POST "$UPLOAD_URL" \
      -H "Authorization: Bearer $TOKEN" \
      -F "file=@$cover_file" \
      -F "directory=official" | python3 -c "import sys, json; print(json.load(sys.stdin)['data'])" 2>/dev/null)
    echo "  封面URL: $cover_url"

    # 上传其他图片
    images_urls="$cover_url"
    for img in "$dir"/图片*.jpg; do
      if [ -f "$img" ] && [ "$img" != "$cover_file" ]; then
        echo "  上传: $(basename "$img")"
        img_url=$(curl -s -X POST "$UPLOAD_URL" \
          -H "Authorization: Bearer $TOKEN" \
          -F "file=@$img" \
          -F "directory=official" | python3 -c "import sys, json; print(json.load(sys.stdin)['data'])" 2>/dev/null)
        images_urls="$images_urls,$img_url"
      fi
    done

    echo "  图片URLs: $images_urls"

    # 插入数据库
    mysql -u root -p123456 goodpoint -e "
      INSERT INTO goods (name, cover, images, price, original_price, category, tags, stock, sales, status)
      VALUES ('$(echo "$short_name" | sed "s/'/\\\\'/g")', '$cover_url', '$images_urls', $price, $original_price, '手办', '官方,正品', 100, 0, 'on_sale');
    " 2>/dev/null

    echo "  已添加到数据库"
    echo ""
  fi
done

echo "完成！"