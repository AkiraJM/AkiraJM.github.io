import cv2
import numpy as np

def calc_normal_map(height_field, height_scale):
    h, w = height_field.shape[0], height_field.shape[1]
    normal_map = np.zeros((h, w, 3))
    for i in range(h):
        for j in range(w):
            up1 = (j + 1) % w
            vp1 = (i + 1) % h
            dhu = height_field[i][up1] - height_field[i][j]
            dhv = height_field[vp1][j] - height_field[i][j]
            dhu = height_scale * dhu
            dhv = height_scale * dhv
            normal = np.cross(np.array([dhv, 1, 0]), np.array([dhu, 0, 1]))
            normal_map[i,j,:] = normal/np.linalg.norm(normal, ord = 2)
    normal_map = normal_map * 0.5 + 0.5
    return normal_map

width = 400
height = 400
L0 = np.array([1,1])
rl0 = 5
#L0 = L0 / np.linalg.norm(L0, ord=2)
b = 10
q = 0.1
D = 0.01
sigma = 1
iter = 300
duration = 1
normal_height_scale = 1

height_field = np.random.rand(width, height)

for i in range(iter):
    height_field = height_field - q

    Lx = np.floor(L0[0] + b * height_field)
    Ly = np.floor(L0[1] + b * height_field)
    for dx in range(height):
        for dy in range(width):
            newx = int((Lx[dx][dy] + dx) % width)
            newy = int((Ly[dx][dy] + dy) % height)
            height_field[newx][newy] += q

    height_field = cv2.GaussianBlur(height_field, (11,11), sigma)

    dl0 = np.random.rand(2) - 0.5
    L0 = L0 + rl0 * dl0

    cv2.imshow("height", height_field)
    if (i == 8):
        normal_map = calc_normal_map(height_field, normal_height_scale)
        cv2.imshow("normal", normal_map)
        cv2.waitKey()
        cv2.imwrite("ripple_normal.jpg", normal_map*256)
        cv2.imwrite("ripple_view.jpg", height_field * 256)
        break
    else:
        print(i)
        cv2.waitKey(duration)